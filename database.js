const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "demo1",
    password: "demo123",
    database: "demo"
})

client.connect();

client.on("connect", () => {
    console.log("Database connection");
})
client.on("end", () => {
    console.log("Connection end")
})

client.query(`select * from users where id=$1`, [1], (err, result) => {
    if(!err) {
        console.log(result.rows);
    }
    client.end();
})