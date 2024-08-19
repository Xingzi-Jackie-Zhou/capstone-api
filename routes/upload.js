// import path from "path";
// import multer from "multer";
// import fs from "fs";
// import express from "express";
// import authenticateToken from "./middleware/authenticateToken.js";
// import { parse } from "csv-parse/sync";
// const router = express.Router();

// import initKnex from "knex";
// import configuration from "../knexfile.js";
// const knex = initKnex(configuration);
// // export default router;
// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const userId = req.user.id; // Assuming req.user contains the authenticated user's info
//     const uploadPath = path.join("upload", userId.toString());
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // File upload route
// router.post(
//   "/upload",
//   authenticateToken,
//   upload.fields([{ name: "weather" }, { name: "discharge" }]),
//   async (req, res) => {
//     try {
//       const { siteName, stationId, riverName, city, climateId } = req.body;
//       const userId = req.user.id;

//       // Process weather file
//       if (req.files["weather"]) {
//         const weatherFile = req.files["weather"]
//           ? req.files["weather"][0].path
//           : null;
//         const weatherData = fs.readFileSync(weatherFile);
//         //const records = parse(weatherData, { columns: true });
//         const records = parse(weatherData, {
//           columns: (header) => header.map((col) => col.replace(/'/g, "")), // Removes single quotes from header names
//           trim: true,
//         });
//         console.log("Weather Records:", records);

//         await knex.transaction(async (trx) => {
//           for (const record of records) {
//             await trx("weather").insert({
//               city_name: record.city_name, // Ensure data integrity
//               climate_id: record.climate_id,
//               date: record.date,
//               ave_temperature: record.ave_temperature || null,
//               total_preciptation: record.total_preciptation || null,
//               user_id: userId,
//             });
//           }
//         });
//       }

//       // Process discharge file
//       if (req.files["discharge"]) {
//         const dischargeFile = req.files["discharge"]
//           ? req.files["discharge"][0].path
//           : null;
//         const dischargeData = fs.readFileSync(dischargeFile);
//         //const records = parse(dischargeData, { columns: true });
//         const records = parse(dischargeData, {
//           columns: (header) => header.map((col) => col.replace(/'/g, "")), // Removes single quotes from header names
//           trim: true,
//         });
//         await knex.transaction(async (trx) => {
//           for (const record of records) {
//             console.log("Record before insertion:", record);
//             await trx("discharge").insert({
//               station_id: record.station_id,
//               date: record.date,
//               discharge: record.discharge,
//               water_level: record.water_level,
//               user_id: userId,
//             });
//           }
//         });
//       }

//       // Insert into main_record table
//       await knex("main_record").insert({
//         site_name: siteName,
//         site_id: stationId,
//         river: riverName,
//         city_id: climateId,
//         user_id: userId,
//       });

//       // Insert into weather_main_record table
//       await knex("weather_main_record").insert({
//         weather_id: climateId,
//         weather_site: city,
//         user_id: userId,
//       });

//       // Clean up uploaded file
//       fs.unlinkSync(uploadPath);

//       res
//         .status(200)
//         .json({ message: "File processed and data inserted successfully" });
//     } catch (error) {
//       console.error("Error processing file:", error);
//       res.status(500).json({ error: "Error processing file" });
//     }
//   }
// );

// export default router;

import path from "path";
import multer from "multer";
import fs from "fs";
import express from "express";
import authenticateToken from "./middleware/authenticateToken.js";
import csvtojson from "csvtojson";
const router = express.Router();

import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id; // Assuming req.user contains the authenticated user's info
    const uploadPath = path.join("upload", userId.toString());
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// File upload route
router.post(
  "/upload",
  authenticateToken,
  upload.fields([{ name: "weather" }, { name: "discharge" }]),
  async (req, res) => {
    try {
      const { siteName, stationId, riverName, city, climateId } = req.body;
      const userId = req.user.id;

      // Process weather file
      if (req.files["weather"]) {
        const weatherFilePath = req.files["weather"][0].path;
        const weatherRecords = await csvtojson().fromFile(weatherFilePath);
        console.log("Weather Records:", weatherRecords);

        await knex.transaction(async (trx) => {
          for (const record of weatherRecords) {
            await trx("weather").insert({
              city_name: record.city_name, // Ensure data integrity
              climate_id: record.climate_id,
              date: record.date,
              ave_temperature: parseFloat(record.ave_temperature) || null,
              total_preciptation: parseFloat(record.total_preciptation) || null,
              user_id: userId,
            });
          }
        });
      }

      // Process discharge file
      if (req.files["discharge"]) {
        const dischargeFilePath = req.files["discharge"][0].path;
        const dischargeRecords = await csvtojson().fromFile(dischargeFilePath);
        console.log("Discharge Records:", dischargeRecords);

        await knex.transaction(async (trx) => {
          for (const record of dischargeRecords) {
            console.log("Record before insertion:", record);
            await trx("discharge").insert({
              station_id: record.station_id,
              date: record.date,
              discharge: parseFloat(record.discharge) || null,
              water_level: parseFloat(record.water_level) || null,
              user_id: userId,
            });
          }
        });
      }

      // Insert into main_record table
      await knex("main_record").insert({
        site_name: siteName,
        site_id: stationId,
        river: riverName,
        city_id: climateId,
        user_id: userId,
      });

      // Insert into weather_main_record table
      await knex("weather_main_record").insert({
        weather_id: climateId,
        weather_site: city,
        user_id: userId,
      });

      // Clean up uploaded file
      fs.unlinkSync(req.files["weather"][0].path);
      fs.unlinkSync(req.files["discharge"][0].path);

      res
        .status(200)
        .json({ message: "File processed and data inserted successfully" });
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ error: "Error processing file" });
    }
  }
);

export default router;
