const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const encodedPath = encodeURIComponent("");

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

    const mapsWithFirstImage = {};

    response.data.forEach(file => {
        const path = file.filePath;

        if (!path.startsWith("/Arp Racing/library/")) return;

        const relativePath = path.replace("/Arp Racing/library/", "");
        const topLevelName = relativePath.split("/")[0];

        if (!mapsWithFirstImage[topLevelName]) {
            mapsWithFirstImage[topLevelName] = file.name;
        }
    });

    console.log(mapsWithFirstImage);


    res.json({
      success: true,
      data: mapsWithFirstImage,
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

router.get("/:id", async (req, res) => {
  try {
    const encodedPath = encodeURIComponent("/Arp Racing/library/" + req.params.id + "/");

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

    const fileNames = response.data.map(file => file.name);

    res.json({
      success: true,
      data: fileNames,
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
