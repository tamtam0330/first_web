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

let now = new Date();
now = `${now.getUTCFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

module.exports.bring_board = (req, res) => {
    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            return
        }

        const exec = conn.query('select * from board',
            (err, result) => {
                conn.release();
                console.log('실행된 SQL: ' + exec.sql)

                if (err) {
                    console.log('SQL 실행시 오류 발생')
                    console.dir(err);

                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf-8' })
                    res.write('<h1>SQL query 실행 실패</h1>')
                    res.end();
                    return
                }

                if (result) {
                    res.render('board', { Lists: result });
                }
                else {
                    console.log('Inserted 실패')

                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf-8' })
                    res.write('<h1>사용자 추가 실패</h1>')
                    res.end();
                }
            }
        )
    })
}

module.exports.post_board = (req, res) => {
    const paramTitle = req.body.b_title;
    const paramContent = req.body.b_content;
    const paramID = req.session.member.id;

    pool.getConnection((err, conn) => {

        if (err) {
            console.log('Mysql getConnection error. aborted');
            res.writeHead('200', { 'Content-type': 'text/html; charset = utf8' })
            res.write('<h1>서버 연결 실패</h1>')
            res.end();
            return
        }
        console.log(paramID);
        const exec = conn.query('insert into board (b_title, b_content, b_upload_date, b_u_id) values (?, ?, ?, ?)',
            [paramTitle, paramContent, now, paramID],
            (err, result) => {
                conn.release();
                console.log('실행된 SQL: ' + exec.sql)

                if (err) {
                    console.dir(err);
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf-8' })
                    res.write('<h1>SQL query 실행 실패</h1>')
                    res.end();
                    return
                }

                if (result) {
                    res.send("<script>alert('게시 성공!'); location.href='/board';</script>");

                    return
                }
                else {
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf-8' })
                    res.write('<h1>게시 실패</h1>' + rows.length)
                    res.end();
                    return
                }
            })
    })
}

module.exports.delete = (req, res) => {
    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            return
        }

        var b_id = req.query.b_id;

        const exec = conn.query(`delete from board where b_id='${b_id}'`,
            (err, result) => {
                conn.release();

                if (err) {
                    console.log('SQL 실행시 오류 발생')
                    console.dir(err);
                    return
                }

                const exec2 = conn.query(`delete from comment where c_b_id='${b_id}'`,
                    (err, result) => {
                        conn.release();

                        if (err) {
                            console.log('SQL 실행시 오류 발생')
                            console.dir(err);
                            return
                        }

                        res.send("<script>alert('삭제되었습니다.'); location.href='/board';</script>");
                    }
                )
            })
    })
}

module.exports.update = (req, res) => {

    const paramTitle = req.body.b_title;
    const paramContent = req.body.b_content;
    var b_id = req.query.b_id;

    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            return
        }


        const exec = conn.query('update board set b_title = ?, b_content = ? where b_id = ?',
            [paramTitle, paramContent, b_id],
            (err, result) => {
                conn.release();

                if (err) {
                    console.dir(err);
                    return
                }

                if (result) {
                    res.send(`<script>alert('게시물 수정 완료!'); location.href='/page?b_id=${b_id}';</script>`);
                    return
                }
                else {
                    return
                }
            })
    })
}

