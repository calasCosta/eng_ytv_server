require('dotenv').config();
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: "eng_with_ytv"
});

connection.connect((err)=>{
    if(err) throw err;
    console.log("Connection stablished.")
})

module.exports = connection;