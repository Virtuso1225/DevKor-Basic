const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./database');
const {auth, refreshVerify} = require('./authMiddleware');

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false}))

server.get('/todo/lists', async (_, res) => {
    try{
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = `SELECT id, content, IF(isChecked, 'true', 'false') as isChecked FROM todoList`;
        const [rows] = await pool.query(sqlQuery);
        const data = rows.map(row => ({...row, isChecked: row.isChecked === 'true' ? true :false}))
        res.status(200).json(data)
        connection.release();
    }
    catch(error){
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
        res.status(201).json({result: rows})
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
        const message = isChecked ? 'TODO가 완료되었습니다!' : 'TODO가 최소되었습니다!';
        res.status(201).json({code: 201, message, data: null, statusCode: 201})
        connection.release();
    } catch(error){
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
    } catch(error){
        res.sendStatus(500);
    }
})

server.get('/todo/secure/lists', auth, async(_, res)=>{
    try{
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = `SELECT id, content, IF(isChecked, 'true', 'false') as isChecked FROM todoList`;
        const [rows] = await pool.query(sqlQuery);
        const data = rows.map(row => ({...row, isChecked: row.isChecked === 'true' ? true :false}))
        console.log(data)
        res.status(200).json({code: 200, message: 'TODO가 성공적으로 조회되었습니다!', data, statusCode: 200})
        connection.release();
    }
    catch(error){
        res.status(500).json({code: 'ERROR', message: '서버 에러가 발생했습니다. 다시 시도해주세요.', data: null, statusCode: 500});
    }
})

server.post('/todo/secure/create', auth, async (req, res) => {
    try{
        const {content} = req.body;
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'INSERT INTO todoList (content) VALUES (?)';
        const data = [content];
        const [rows] = await pool.query(sqlQuery, data);
        res.status(201).json({code: 201, message: 'TODO가 생성되었습니다!', data: rows, statusCode: 201})
        connection.release();
    } catch(error){
        res.status(500).json({code: 'ERROR', message: '서버 에러가 발생했습니다. 다시 시도해주세요.', data: null, statusCode: 500});
    }
})

server.patch('/todo/secure/update/:id', auth, async (req, res) => {
    try{
        const {id} = req.params;
        const {isChecked} = req.body;
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'UPDATE todoList SET isChecked = ? WHERE id = ?';
        const data = [isChecked, id];
        const [rows] = await pool.query(sqlQuery, data);
        const message = isChecked ? 'TODO가 완료되었습니다!' : 'TODO가 최소되었습니다!';
        res.status(201).json({code: 201, message, data: null, statusCode: 201});        
        connection.release();
    } catch(error){
        res.status(500).json({code: 'ERROR', message: '서버 에러가 발생했습니다. 다시 시도해주세요.', data: null, statusCode: 500});
    }
})

server.delete('/todo/secure/delete/:id', auth, async (req, res) => {
    try{
        const {id} = req.params;
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'DELETE FROM todoList WHERE id = ?';
        const data = [id];
        const [rows] = await pool.query(sqlQuery, data);
        res.status(200).json({code: 200, message: 'TODO가 성공적으로 삭제되었습니다!', data: rows, statusCode: 200})
        connection.release();
    } catch(e){
        res.status(500).json({code: 'ERROR', message: '서버 에러가 발생했습니다. 다시 시도해주세요.', data: null, statusCode: 500});
    }
})

server.post('/create/user', async(req, res)=> {
    try{
        const {username, password} = req.body;
        const connection = await pool.getConnection(async conn => conn);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const sqlQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        const data = [username, hash];
        const [rows] = await pool.query(sqlQuery, data);
        res.status(200).json(rows)
        connection.release();
    }catch(error){
        res.sendStatus(500);
    }
})

server.post('/login', async(req, res)=>{
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({code:400, message: '아이디와 비밀번호를 입력해주세요.', data: null, statusCode: 400});
    }
    try{
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'SELECT * FROM users WHERE username = ?';
        const data = [username];
        const [rows] = await pool.query(sqlQuery, data);
        if(rows.length === 0){
            res.status(400).json({code:400, message: '존재하지 않는 유저입니다.', data: null, statusCode: 400});
            connection.release();
            return;
        }
        const result = bcrypt.compareSync(password, rows[0].password);
        if(result){
            rows[0].password = undefined;
            const accessToken = jwt.sign({username}, process.env.JWT_SECRET_KEY, {expiresIn: '1m'});
            const refreshToken = jwt.sign({}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
            const expiresAt = new Date(jwt.decode(accessToken).exp * 1000);
            const tokensQuery = 'SELECT * FROM tokens WHERE username = ?';
            const [isExist] = await pool.query(tokensQuery, [username]);
            if(isExist.length !== 0){
                const deleteQuery = 'UPDATE tokens SET refresh = ? WHERE username = ?';
                await pool.query(deleteQuery, [refreshToken, username]);
                res.status(200).json({code: 'SUCCESS', message: '로그인에 성공하였습니다!',data: {accessToken, refreshToken, expiresAt}, statusCode: 200});
                connection.release();
                return;
            }
            const sqlQuery = 'INSERT INTO tokens (username, refresh) VALUES (?,?)';
            const data = [username, refreshToken];        
            await pool.query(sqlQuery, data);
            res.status(200).json({code: 'SUCCESS', message: '로그인에 성공하였습니다!',data: {accessToken, refreshToken, expiresAt}, statusCode: 200});
            connection.release();
        }else{
            res.status(400).json({code: 'FAIL',message: '비밀번호가 일치하지 않습니다!!', data: null, statusCode: 400});
            connection.release();
        }
    }catch(error){
        console.log(error)
        res.status(500).json({code: 'ERROR', message: '서버 에러가 발생했습니다. 다시 시도해주세요.', data: null, statusCode: 500});
    }
})

server.post('/logout', auth, async(req, res)=>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.decode(token);
        const user = decoded.username;
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'DELETE FROM tokens WHERE username = ?';
        const data = [user];
        const [rows] = await pool.query(sqlQuery, data);
        res.status(200).json({code: 'SUCCESS', message: '로그아웃에 성공하였습니다!', data: null, statusCode: 200});
        connection.release();
    }catch(error){
        res.status(500).json({code: 'ERROR', message: '서버 에러가 발생했습니다. 다시 시도해주세요.', data: null, statusCode: 500});
    }
})


server.post('/refresh', async(req, res)=>{
    const {refreshToken, username} = req.body;

    try{
        const connection = await pool.getConnection(async conn => conn);
        const sqlQuery = 'SELECT * FROM tokens WHERE username = ?';
        const [rows] = await pool.query(sqlQuery, [username]);
        if(rows[0].refresh !== refreshToken){
            console.log('refreshToken is not valid')
            return res.sendStatus(401);
        }
        if(jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)){
        const newAccessToken = jwt.sign({username: username}, process.env.JWT_SECRET_KEY, {expiresIn: '5m'});
        const expiresAt = new Date(jwt.decode(newAccessToken).exp * 1000);
        res.status(200).json({accessToken: newAccessToken, expiresAt});
        connection.release();
        }else{
            console.log("error")
            return res.sendStatus(401);
        }
    }catch(error){
        console.log(error)
        res.sendStatus(500);
    }
})


server.listen(8080,()=>{
    console.log('Server is running on port 8080');
})