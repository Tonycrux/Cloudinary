const cloudinary = require('cloudinary').v2;
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


cloudinary.config({
  cloud_name: 'dfogqrxnn',
  api_key: '741527945872527',
  api_secret: '9ozCzJSEn1h1-BAvznLzDRqd5eA',
  secure: true
});

async function getImagesFromFolder(folderName) {
    const result = await cloudinary.search
      .expression(`folder:${folderName}`)
      .sort_by('public_id','desc')
      .max_results(20)
      .execute();
  
    const urls = result.resources.map(img => img.secure_url);
    console.log(urls);
  }
  
  getImagesFromFolder('tizeti');


  app.get('/images/:folder', async (req, res) => {
    const folder = req.params.folder;
    try {
      const result = await cloudinary.search
        .expression(`folder:${folder}`)
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();
  
      const urls = result.resources.map(img => img.secure_url);
      res.json({ folder, count: urls.length, urls });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch folder images.' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
