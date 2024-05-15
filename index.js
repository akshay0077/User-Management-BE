import express from "express";
import cors from "cors"
import dotenv from "dotenv"

import './db/conn.js'
import router from './routes/router.js'

const app = express();

const PORT = process.env.PORT || 8080

// Middleware
app.use(cors());
app.use(express.json());

dotenv.config();

// Static file serving
app.use("/uploads",express.static("./uploads"));
app.use("/files",express.static("./public/files"));

app.use('/api/v1',router);

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})