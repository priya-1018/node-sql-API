import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser'
const app = express();

app.use(bodyParser.json());
const PORT = 8080;
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'employee_db'
});
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

app.get("/test", (req, res) => {
    // res.status(200).send("<h1>Nodejs Mysql app</h1>");
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) {
          res.status(500).send('Error retrieving users');
          return;
        }
        res.json(results);
      });
});
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM employee WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
app.post('/users', (req, res) => {
    const { name, employee_code, salary } = req.body;
    db.query('INSERT INTO employee (name, employee_code, salary) VALUES (?, ?, ?)', [name, employee_code, salary], (err, results) => {
        if (err) {
            res.status(500).send('Error adding user');
            return;
        }
        res.status(201).send('User added');
    });
});
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, employee_code, salary} = req.body;
    const query = 'UPDATE employee SET name = ?, employee_code = ?, salary = ? WHERE id = ?';
    db.query(query, [name, employee_code, salary, id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send('User updated successfully');
    });
  });


app.listen(PORT, () => {
    console.log("server running");
});
