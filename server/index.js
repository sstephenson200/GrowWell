const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

//Read .env File
dotenv.config();

//Server Set-Up
const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Started on Port: ${port}`));

app.use(express.json());
app.use(cookieParser());

//DB Connection
mongoose.connect(process.env.MDB_CONNECT, (error) => {
    if (error) {
        return console.error(error);
    } else {
        console.log("Connected to MongoDB");
    }
});

//Route Set-up
app.use("/user", require("./routers/userRouter"));
app.use("/garden", require("./routers/gardenRouter"));
app.use("/alarm", require("./routers/alarmRouter"));
app.use("/note", require("./routers/noteRouter"));
app.use("/plant", require("./routers/plantRouter"));

