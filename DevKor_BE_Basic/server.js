const express = require('express');
const cors = require('cors');
const pool = require('./database');

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false}))

server.get('/todo/lists', async (req, res) => {
    try{
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'SELECT * FROM todoList';
        const [rows] = await pool.query(sqlQuery);
        res.status(200).json(rows)
        connection.release();
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})


server.post('/todo/create', async (req, res) => {
    try{
        const {content} = req.body;
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'INSERT INTO todoList (content) VALUES (?)';
        const data = [content];
        const [rows] = await pool.query(sqlQuery, data);
        res.status(200).json({result: rows})
        connection.release();
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

server.patch('/todo/update/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const {isChecked} = req.body;
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'UPDATE todoList SET isChecked = ? WHERE id = ?';
        const data = [isChecked, id];
        const [rows] = await pool.query(sqlQuery, data);
        res.status(200).json(rows)
        connection.release();
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

server.delete('/todo/delete/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'DELETE FROM todoList WHERE id = ?';
        const data = [id];
        const [rows] = await pool.query(sqlQuery, data);
        res.status(200).json({result: rows})
        connection.release();
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

server.listen(8080,()=>{
    console.log('Server is running on port 8080');
})