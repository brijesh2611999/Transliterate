const express = require('express');
// import app from 'express';
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const database = require('./config/database');
const userRoute = require('./routes/userRoute');
//database connection
database.connect();

app.use(express.json());	

const cors = require("cors");
app.use(
	cors({
		// // origin:"http://localhost:5173/",
		origin:"http://localhost:5173",
		// // origin: "http://192.168.108.244:3000", // Replace with your frontend URL
		// // origin: "https://algorithm-visualizer-one-delta.vercel.app", // Replace with your frontend URL
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow required methods
		allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
	})
);

// Manually handle preflight OPTIONS request
// app.options("*", cors()); 


//rotues
app.use("/api/v1", userRoute);

//server activation
app.listen(PORT,()=>{
  console.log(`server started at ${PORT}`);
})

//default routes
app.get('/',(req,res)=>{
  res.send('this is home page');
})

