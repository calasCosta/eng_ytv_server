const express = require('express');
const router = express.Router();
const con = require('../routes/db/db');


router
.get("/api/users", function(req, res){
    let sql = "select * from users"
    con.query(sql, function(err, rows){
        if (err) throw err;

        res.send(rows).status(200).end();
    });
})
.patch("/api/users", function(req, res){
    let searchKey = req.body.searchKey || "";
    let sql = `select * from users where username like '%${searchKey}%' order by username`
    con.query(sql, function(err, rows){
        if (err) throw err;

        console.log(rows);
        res.send(rows).status(200).end();
    });
});

module.exports = router;