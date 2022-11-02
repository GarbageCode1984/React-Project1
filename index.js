const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://rkqlwl1984:djqlf0595!@cluster0.kmasd50.mongodb.net/test",
        {
            useNewUrlParser: true,
        }
    )
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
