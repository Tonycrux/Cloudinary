// Backend: Express API to fetch images from Cloudinary folder
// Save this as `index.js`

const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

cloudinary.config({
    cloud_name: 'dfogqrxnn',
    api_key: '741527945872527',
    api_secret: '9ozCzJSEn1h1-BAvznLzDRqd5eA',
    secure: true
  });
  

app.get('/images/folder/:folderName', async (req, res) => {
  const folder = req.params.folderName;
  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('public_id','desc')
      .max_results(30)
      .execute();

    const urls = result.resources.map(img => img.secure_url);
    res.json({ folder, urls });
  } catch (err) {
    res.status(500).json({ error: 'Cloudinary folder query failed' });
  }
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));

// Frontend: React component to view folder images
export function FolderViewer() {
  const [images, setImages] = React.useState([]);
  const [folder, setFolder] = React.useState("products");

  React.useEffect(() => {
    fetch(`http://localhost:3000/images/folder/${folder}`)
      .then(res => res.json())
      .then(data => setImages(data.urls || []));
  }, [folder]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Images in Folder: {folder}</h1>
      <input
        className="p-2 border rounded mb-4 w-full"
        value={folder}
        onChange={e => setFolder(e.target.value)}
        placeholder="Enter folder name"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, i) => (
          <img key={i} src={url} alt="cloudinary-img" className="rounded-xl shadow" />
        ))}
      </div>
    </div>
  );
}
