// const { Client } = require('pg');

// const client = new Client({
//     host: "localhost",
//     port: 5432,
//     user: "ccadmin",
//     password: "ccadmin",
//     database: "careercraft"
// })

// client.connect();

// client.on("connect", () => {
//     console.log("Database connection");
// })
// client.on("end", () => {
//     console.log("Connection end")
// })

// client.query(`select name from users where id=1;`,(err, result) => {
//     if(!err) {
//         console.log(result.rows);
//     }
//     else{
//         console.log(err);
//     }
//     client.end();
// })