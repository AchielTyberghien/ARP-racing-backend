const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const encodedPath = encodeURIComponent("/Arp Racing/Carousel/");

    const url = `${process.env.IMAGEKIT_BASE}?path=${encodedPath}`;

    const authString = Buffer
      .from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`)
      .toString("base64");

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${authString}`
      }
    });

    const pictureList = response.data.map(file => ({ name: file.name, description: file.description }));

    
    res.json({
      success: true,
      pictures: pictureList,
    });

  } catch (error) {
    const apiResponse = error.response ? error.response.data : null;

    res.status(500).json({
      success: false,
      message: "Error fetching ImageKit data",
      error: error.message,
      apiResponse,
    });
  }
});

module.exports = router;
