const express = require('express');
const cloudinary = require('cloudinary').v2;


const app = express();
const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: 'dfogqrxnn',
  api_key: '741527945872527',
  api_secret: '9ozCzJSEn1h1-BAvznLzDRqd5eA',
  secure: true
});

app.get('/gallery/:folder', async (req, res) => {
  const folder = req.params.folder;
  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    // Apply transformation: compress images with quality auto, 
    // use auto format, and use "limit" crop mode to prevent enlargement
    const urls = result.resources.map(img => {
      return img.secure_url.replace(
        '/upload/',
        '/upload/q_auto:good,f_auto,c_limit,w_800/'
      );
    });

    // Build HTML so each image is on its own row
    let html = `<html>
      <head>
        <title>${folder} Gallery</title>
        <style>
          /* Ensures images are displayed one per row */
          .gallery-image {
            display: block;
            margin: 20px auto; /* centers the image with margin */
          }
        </style>
      </head>
      <body>
        <h1>Gallery: ${folder}</h1>`;

    urls.forEach(url => {
      html += `<div>
                 <img src="${url}" class="gallery-image" alt="Gallery image" />
               </div>`;
    });
    
    html += `</body></html>`;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading images.');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Tizeti-images');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
