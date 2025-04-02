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

app.get('/images/:tag', async (req, res) => {
  const tag = req.params.tag;
  try {
    const result = await cloudinary.search
      .expression(`tags:${tag}`)
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    const resources = result.resources;

    // If no images found with the tag, return 404 JSON
    if (!resources || resources.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `No images found with tag "${tag}".`
      });
    }

    // Apply transformation to each image URL
    const urls = resources.map(img =>
      img.secure_url.replace(
        '/upload/',
        '/upload/q_auto:good,f_auto,c_limit,w_800/'
      )
    );

    res.json({
      status: 'success',
      tag,
      count: urls.length,
      images: urls
    });

  } catch (err) {
    console.error('Cloudinary error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while loading images.'
    });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to my Image Rendering App');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
