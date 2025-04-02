require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;


const app = express();
const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
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

    const resources = result.resources;

    // If no images found, render a custom error page
    if (!resources || resources.length === 0) {
      return res.status(404).send(`
        <html>
          <head><title>Folder Not Found</title></head>
          <body style="font-family:sans-serif;text-align:center;margin-top:50px;">
            <h1>🚫 Folder "${folder}" Not Found</h1>
            <p>No images were found in the folder "<strong>${folder}</strong>".</p>
            <a href="/">Go back</a>
          </body>
        </html>
      `);
    }

    // Otherwise, transform and display the images
    const urls = resources.map(img => {
      return img.secure_url.replace(
        '/upload/',
        '/upload/q_auto:good,f_auto,c_limit,w_800/'
      );
    });

    let html = `<html>
      <head>
        <title>${folder} Gallery</title>
        <style>
          .gallery-image {
            display: block;
            margin: 20px auto;
          }
        </style>
      </head>
      <body>
        <h1 style="text-align:center;">Gallery: ${folder}</h1>`;

    urls.forEach(url => {
      html += `<div>
                 <img src="${url}" class="gallery-image" alt="Gallery image" />
               </div>`;
    });

    html += `</body></html>`;
    res.send(html);

  } catch (err) {
    console.error('Cloudinary error:', err);
    res.status(500).send(`
      <html>
        <head><title>Server Error</title></head>
        <body style="font-family:sans-serif;text-align:center;margin-top:50px;">
          <h1>⚠️ Something went wrong</h1>
          <p>Unable to load images from folder "<strong>${folder}</strong>".</p>
        </body>
      </html>
    `);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to my Image Rendering App');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
