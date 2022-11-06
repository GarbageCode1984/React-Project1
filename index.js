const express = require("express");
const app = express();
const port = 5000;
const { User } = require("./models/User");
const mongoose = require("mongoose");

//application/x-www-from-urlencoded
app.use(express.urlencoded({ extended: true }));
//application/json
app.use(express.json());

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

app.post("/register", (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다.
    const user = new User();

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
