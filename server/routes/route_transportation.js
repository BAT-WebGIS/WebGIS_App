const express = require('express');
const router = express.Router();
const pool = require('../db/config.js'); //import DB connection

// FOOD: return all point features as a GeoJSON FeatureCollection
//---------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        fid,
        bemerk,
        art
        ST_AsGeoJSON(geom)::json AS geometry
      FROM transportation
    `);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        fid: row.fid,
        bemerk: row.bemerk,
        art: row.art
      }
    }));

    const geojson = {
      type: "FeatureCollection",
      features: features
    };

    res.json(geojson);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching POI data" });
  }
});

module.exports = router;