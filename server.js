require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.POST || 3500;

//Connect to mongoDB
connectDB();

//Custom middleware Logger
app.use(logger);

//Handle options credentials check - before cors
// and fetch cookies credentials requirements
app.use(credentials);

//Apply cross origin resource share
app.use(cors(corsOptions));

//Built-in middleware to handle urlencoded data. In other words form data
app.use(express.urlencoded({ extended: false }));

//Built-in middleware for json
app.use(express.json());

//Built-in middleware for cookies
app.use(cookieParser());

//Serve static files
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// verified routes
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
