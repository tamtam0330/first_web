
// 모듈
const express = require('express')
const mysql = require('mysql2')
const path = require('path')
const static = require('serve-static')
const dbconfig = require('../config/dbconfig.json')
const nunjucks = require('nunjucks')
const session = require('express-session')
const app = express()


// 앱 세팅
nunjucks.configure('views', {   //views 파일 안에 있는 파일들을 nunjucks 템플릿을 적용 
    express: app,
    watch: true,
});

app.set("views", "./views")
app.set("view engine", 'html')

module.exports = app;

//
app.use(express.urlencoded({ extended: true })) //html 파싱해서 req.body 로 사용
app.use(express.json()) 
app.use(express.static(__dirname + '/public'))  //정적파일 /public 이용


app.use(session({   //session
    secret: 'secretkey1',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))

app.use((req, res, next) => {   // 전역변수 설정

    res.locals.id = "";
    res.locals.name = "";

    if (req.session.member) {
        res.locals.id = req.session.member.id
        res.locals.name = req.session.member.name
    }
    next()
})

//

const homepageRouter = require("./routes/hompage");
app.use("/homepage", homepageRouter);

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const boardRouter = require("./routes/board");
app.use("/board", boardRouter);

const pageRouter = require("./routes/page");
app.use("/page", pageRouter);

//

app.get('/', (req, res) => {
    res.render('login');
})






















