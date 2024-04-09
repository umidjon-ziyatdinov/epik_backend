const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectDatabase = require("./db");
const cors = require("cors")

app.use(cors());

app.use(express.json());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.json({limit: '50mb'})); 

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./.env",
  });
}
// connect db
connectDatabase();


// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});



const enquiry = require("./controller/enquiry");

app.use("/api", enquiry)

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}`
  );
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});

