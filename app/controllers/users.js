const mysql = require('mysql2')
const dbconfig = require('../../config/dbconfig.json')
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})

module.exports.render_login = (req, res) => {
    res.render('login');
}

module.exports.render_adduser = (req, res) => {
    res.render('adduser');
}

module.exports.login = (req, res) => {

    const paramId = req.body.id;
    const paramPassword = req.body.password;

    console.log('로그인 요청' + paramId + ' ' + paramPassword);

    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            res.writeHead('200', { 'Content-type': 'text/html; charset = utf8' })
            res.write('<h1>서버 연결 실패</h1>')
            res.end();
            return
        }

        const exec = conn.query('select `id`, `name` from `users` where `id`=? and `password`= SHA2(?,256)',
            [paramId, paramPassword],
            (err, rows) => {
                conn.release();
                console.log('실행된 SQL: ' + exec.sql)

                if (err) {
                    console.dir(err);
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf-8' })
                    res.write('<h1>SQL query 실행 실패</h1>')
                    res.end();
                    return
                }

                if (rows.length > 0) {
                    console.log('아이디 [%s], 패스워드가 일치하는 사용자 [%s] 찾음', paramId, rows[0].name);
                    console.log(rows[0])
                    req.session.member = rows[0]
                    res.send("<script>alert('로그인 성공!'); location.href='/homepage/home';</script>");
                    return
                }
                else {
                    console.log('아이디 [%s], 패스워드가 일치없음', paramId);
                    res.send("<script>alert('로그인 실패. 아이디와 패스워드를 확인하세요.'); location.href='/';</script>");
                    return
                }
            })
    })
}

module.exports.logout = (req, res) => {
    req.session.member = null;
    res.send("<script>alert('로그아웃 되었습니다'); location.href='/';</script>");
}

module.exports.adduser = (req, res) => {
    console.log('/process/adduser 호출됨' + req)

    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;

    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            res.writeHead('200', { 'Content-type': 'text/html; charset = utf8' })
            res.write('<h1>서버 연결 실패</h1>')
            res.end();
            return
        }

        console.log('데이터베이스 연결 끈 얻었음');

        const exec = conn.query('insert into users (id, name, age, password) values (?, ? ,?, SHA2(?,256))',
            [paramId, paramName, paramAge, paramPassword],
            (err, result) => {
                conn.release();
                console.log('실행된 SQL: ' + exec.sql)

                if (err) {
                    console.log('SQL 실행시 오류 발생')
                    res.send("<script>alert('회원가입 실패. 다른 아이디를 이용하세요'); location.href='/users/adduser';</script>");
                    return
                }

                if (result) {
                    console.dir(result)
                    console.log('Inserted 성공')
                    res.send("<script>alert('회원가입 완료.'); location.href='/users/login';</script>");
                }
                else {
                    console.log('Inserted 실패')
                    res.send("<script>alert('회원가입 실패.'); location.href='/users/adduser';</script>");

                }
            }
        )
    })
}

