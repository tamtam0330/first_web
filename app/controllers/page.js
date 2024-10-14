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


module.exports.page = (req, res) => {  
    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            return
        }

        var b_id = req.query.b_id;

        const exec = conn.query(`select * from board left join comment on board.b_id = comment.c_b_id where b_id='${b_id}'`,
            (err, result) => {
                conn.release();

                if (err) {
                    console.log('SQL 실행시 오류 발생')
                    console.dir(err);
                    return
                }

                if (result) {
                    console.log(result);
                    res.render('page', { pageinfo: result });
                }
                else {
                    console.log('실패')
                }
            }
        )

    })
}


module.exports.comment = (req, res) => {

    const paramContent = req.body.c_content;
    var b_id = req.query.b_id;
    const paramID = req.session.member.id;

    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            return
        }


        const exec = conn.query('insert into comment (c_b_id, c_u_id, c_write_date, c_content) values (?, ?, ?, ?)',
            [b_id, paramID, now, paramContent],
            (err, result) => {
                conn.release();

                if (err) {
                    console.dir(err);
                    return
                }

                if (result) {
                    res.send(`<script>alert('댓글 입력 완료!'); location.href='/page?b_id=${b_id}';</script>`);
                    return
                }
                else {
                    return
                }
            })
    })
}


module.exports.delete_comment = (req, res) => {

    var c_id = req.query.c_id;
    var b_id = req.query.b_id;
    console.log(b_id)
    console.log(c_id)

    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            return
        }


        const exec = conn.query(`delete from comment where c_id='${c_id}'`,
            (err, result) => {
                conn.release();

                if (err) {
                    console.log('SQL 실행시 오류 발생')
                    console.dir(err);
                    return
                }

                res.send(`<script>alert('댓글이 삭제되었습니다.'); location.href='/page?b_id=${b_id}';</script>`);
            }
        )
    })
}


module.exports.update_comment = (req, res) => {


    pool.getConnection((err, conn) => {

        if (err) {
            conn.release();
            console.log('Mysql getConnection error. aborted');
            return
        }    

        var b_id = req.query.b_id;

        const exec = conn.query(`select * from board left join comment on board.b_id = comment.c_b_id where b_id='${b_id}'`,
            (err, result) => {
                conn.release();

                if (err) {
                    console.log('SQL 실행시 오류 발생')
                    console.dir(err);
                    return
                }    
                
                if (result) {
                    console.log(result);
                    res.render('update', { pageinfo: result });
                }
                else {
                    console.log('실패')
                }
            }
        )

    })
}
