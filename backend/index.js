// const express = require('express');
// const app = express();
// require('dotenv').config();
// const PORT = process.env.PORT || 4000;
// const database = require('./config/database');
// const userRoute = require('./routes/userRoute');
// //database connection
// database.connect();

// // app.use(express.json());	

// // const cors = require("cors");
// // app.use(
// //     cors({
// //         // origin:"https://transliterate-two.vercel.app",
// //         origin:"http://localhost:5173",
// //         // // origin: "http://192.168.108.244:3000", // Replace with your frontend URL
// //         // // origin: "https://algorithm-visualizer-one-delta.vercel.app", // Replace with your frontend URL
// //         credentials: true,
// //         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow required methods
// //         allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
// //     })
// // );

// // // Manually handle preflight OPTIONS request
// // app.options("*", cors()); 


// // //rotues
// // app.use("/api/v1", userRoute);

// //server activation
// app.listen(PORT,()=>{
//   console.log(`server started at ${PORT}`);
// })

// //default routes
// app.get('/',(req,res)=>{
//   res.send('this is home page');
// })



const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const database = require('./config/database');
const userRoute = require('./routes/userRoute');
const cors = require("cors");

// Database connection
database.connect();

// Middleware
app.use(express.json());

// Simplified CORS configuration
const corsOptions = {
//   origin: "http://localhost:5173",
  origin: "https://transliterate-two.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Routes
app.use("/api/v1", userRoute);

// Default route
app.get('/', (req, res) => {
  res.send('this is home page');
});

// Server activation
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});