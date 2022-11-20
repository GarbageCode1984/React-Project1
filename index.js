const express = require("express");
const app = express();
const port = 5000;
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");
const mongoose = require("mongoose");

//application/x-www-from-urlencoded
app.use(express.urlencoded({ extended: true }));
//application/json
app.use(express.json());

mongoose
    .connect(config.mongoURI, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/api/users/register", (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다.
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, doc });
    });
});

app.post("/api/users/login", (req, res) => {
    //요청된 이메일을 DB에서 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다.",
            });
        }
        // 요청된 이메일이 DB에 있다면 비밀번확 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
                });
            }
            //비밀번호가 맞다면 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

//role 1 어드민
//role 0 일반유저, role 0이 아니면 관리자
app.get("/api/users/auth", auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 뜻
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
