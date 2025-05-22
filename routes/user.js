//1 import express & mysql
import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const aiven_password = process.env.AIVEN_SERVICE_PASSWORD;
const aiven_host = process.env.AIVEN_HOST;
const aiven_port = process.env.AIVEN_PORT;
const aiven_user = process.env.AIVEN_USER;
const aiven_database = process.env.AIVEN_DATABASE;
//2 initialize  router 
const router = express.Router();
//4 create a connection pool (host, user, password, database)
//Test console.log();
//Local connection pool:
const localMySQL = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "project4"
}
//Aiven connection pool:
const AivenMySQL = {
  host: aiven_host,
  port: aiven_port,
  user: aiven_user,
  password: aiven_password,
  database: aiven_database,
  ssl: {
    rejectUnauthorized: false
    //modify to instead use the CA certificate
  }
}
/*const connection = mysql.createPool(localMySQL);*/
const connection = mysql.createPool(AivenMySQL);
//console.log(connection);
connection.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to Aiven MySQL:", err);
  } else {
    console.log("Connected to Aiven MySQL");
    conn.release();
  }
})
//5 router.get 
//Test in browser --> http://localhost:5000/user/john
//6 Query 'uname' from mydb 
router.use(express.json());
router.get('/question/:category', async (req,res)=>{
    try {
        const category = req.params.category
        console.log(category);
        const [rows] = await connection.promise().query(
            `SELECT * FROM ${category};`
        );
        console.log(`rows=${JSON.stringify(rows)}`);
        res.status(202).json({
            user: rows
        });
    } catch (error) {
        res.send(error);
    };
});
router.get('/:uname', async (req,res)=>{
    try {
        const uname = req.params.uname;
        console.log(req.params);
        const data = await connection.promise().query(
            `SELECT * FROM usercredentials WHERE uname=?;`,[uname]
        );
        console.log(`data[0]=${JSON.stringify(data[0])}`);
        res.status(202).json({
            user: data[0]
        });
    } catch (error) {
        res.send(error);
    };
});
router.post("/", async (req, res) => {       
    try {
      const {uname, pword} = req.body;            
      console.log(req.body);
      const data =  await connection.promise().query(
        `insert into usercredentials (uname, pword) values (?, ?);`,[uname,pword]
      );
      console.log(`data[0]=${JSON.stringify(data[0])}`)
      res.status(202).json({ 
        message: data[0]
      });
    } 
    catch (err) {
      res.status(500).json({
        message: err
      });
    }
});
router.post("/question", async (req, res) => {
    try {
        const { question } = req.body;
        const [result] = await connection.promise().query(
            `INSERT INTO category_5 (question) VALUES (?);`, 
            [question]  
        );
        res.status(201).json({
            id: result.insertId,
            question
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            error: "Database connection failed",
        });
    }
});
//3 export router and console.log for diagnosis
console.log('user.js is working');
export default router;