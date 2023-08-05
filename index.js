const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express()
const port = process.env.PORT || 3000;

// mysql connection pool
const pool = mysql.createPool({
    host: 'bjiti6qrqe9gyyqddzjp-mysql.services.clever-cloud.com',
    user: 'uueapab1nwgmqoel',
    password: 'huTpBjSvRLQoaKw3sBwA',
    database: 'bjiti6qrqe9gyyqddzjp',
    connectionLimit: 10
});

// middelware
app.use(bodyParser.json());

// route to get all todos
app.get('/todos', (req,res) => {
    pool.query('SELECT * FROM todos', (err, results) => {
        if (err){
            res.status(500).json({ error : 'Internal Server Error'});
        } else{
            res.json(results);
        }
    });
});

// route to create a new todo
app.post('/todos', (req,res) => {
    const {title, description } = req.body;
    pool.query(
        'INSERT INTO todos (title, description) VALUES (?, ?)',
        [title, description],
        (err, result) => {
            if (err){
                res.status(500).json({ error: 'Internal Server Error'});
            } else {
                const newTodo = {id: result.insertid, title, description};
                res.json(newTodo);
            }
        }
    )
});

// route to update a todo
app.put('/todos/:id', (req,res) => {
    const { title, description} = req.body;
    const todoId = req.params.id;
    pool.query(
        'UPDATE todos SET title=?, description=? WHERE id=?',
        [title, description, todoId],
        (err)=> {
            if (err) {
                res.status(500).json({ error: ' Internal Server Error'})
            } else {
                res.json({ id: todoId, title, description});
            }
        }
    );
});

// route to delete a todo 
app.delete('/todos/:id' , (req,res) => {
    const todoId = req.params.id;
    pool.query('DELETE FROM todos WHERE id=?', [todoId], (err) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error'})
        }else {
            res.json({ id: todoId});
        }
    });
});

// start server
app.listen(port, () => {
    console.log(`Server is runnig on port: ${port}`);
});