import express from "express";
import serverless from "serverless-http";
import mapRoute from "../routes/index.js";

const app = express();

// middlewares if any
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// register routes
mapRoute(app);


export default serverless(app);