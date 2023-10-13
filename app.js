const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const token = require('./token');

const app = express();
const port = 3000;
//const document = new JSDOM(html).window.document;
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 
app.use(bodyParser.urlencoded({ extended: false }));

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'exo_express',
};

// Establish a database connection pool
const pool = mysql.createPool(dbConfig);
// Home
app.get('/',function(req, res){
    res.render('index');
 });
// Route for SELECT query

Toustaches = app.get('/tous_les_taches',/*token,*/ async (req, res) => {
  try {
    // Acquire a connection from the pool
    const connection = await pool.getConnection();

    // Execute a SELECT query

    const [rows] = await connection.execute('SELECT * FROM taches');

    // Release the connection back to the pool
    connection.release();

    res.json(rows); // Send the query result as JSON
  } catch (error) {
    console.error('Error executing SELECT query:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});


//récupérer la liste de toutes les tâches non faites
app.get('/taches_non_terminees',token, async (req, res) => {
    try {
      // Acquire a connection from the pool
      const connection = await pool.getConnection();
  
      // Execute a SELECT query
  
      const [rows] = await connection.execute('SELECT * FROM `taches` WHERE isDone = "false"');
  
      // Release the connection back to the pool
      connection.release();
  
      res.json(rows); // Send the query result as JSON
    } catch (error) {
      console.error('Error executing SELECT query:', error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  });
  //Ajouter une nouvelle tâche
// Route for INSERT query
app.post('/insert',token,async (req, res) => {
  try {
    let { name, dueDate, isDone} = req.body;

    // Acquire a connection from the pool
    const connection = await pool.getConnection();
    name="tache numero 3";
    dueDate="2023-05-07";
    isDone="false";
    // Execute an INSERT query
    let sql = 'INSERT INTO taches (name, dueDate, isDone) VALUES (?,?,?)'
    await connection.execute(sql, [name, dueDate, isDone]);
    
    // Release the connection back to the pool
    connection.release();
    console.log(name);
    res.json({ message: 'Data inserted successfully.' });
    res.redirect('/');
  } catch (error) {
    console.error('Error executing INSERT query:', error);
    res.status(500).json({ error: 'An error occurred while inserting data.' });
  }
});
//Marquer une tâche à done
// Route for Update une tache à Done query
app.post('/update_done/:id',token, async (req, res) => {
    try {
        
      const id_tache = req.params.id;
    
      // Acquire a connection from the pool
      const connection = await pool.getConnection();
    
      // Execute an Update query
      let sql = `UPDATE taches SET isDone="true" WHERE id_tache =${id_tache}`
      await connection.execute(sql);
     
      
      // Release the connection back to the pool
      connection.release();
      res.json({ message: 'Data inserted successfully.' });
      res.redirect('/');
    } catch (error) {
      console.error('Error executing INSERT query:', error);
      res.status(500).json({ error: 'An error occurred while inserting data.' });
    }
  });
    // Modifier une tâche existante
// Route for Update une date de la tache query
app.post('/update_tache/:id',token, async (req, res) => {
    try {
      const id_tache = req.params.id;
      let { name, dueDate, isDone} = req.body;
     name="tache test";
     dueDate="2023-04-07";
     isDone="false";
      // Acquire a connection from the pool
      const connection = await pool.getConnection();
    
      // Execute an Update query
      let sql = `UPDATE taches SET name="${name}",dueDate="${dueDate}",isDone="${isDone}" WHERE id_tache =${id_tache}`
      await connection.execute(sql);
      // Release the connection back to the pool
      connection.release();
      res.json({ message: 'Data inserted successfully.' });
      res.redirect('/');
    } catch (error) {
      console.error('Error executing INSERT query:', error);
      res.status(500).json({ error: 'An error occurred while inserting data.' });
    }
  });
    // Supprimer une tâche (bonus)
// Route for Delete une tache query
app.post('/delete_tache/:id',token, async (req, res) => {
    try {
      const id_tache = req.params.id;
      // Acquire a connection from the pool
      const connection = await pool.getConnection();
    
      // Execute an Delete query
      let sql = `DELETE FROM taches WHERE id_tache =${id_tache}`
      await connection.execute(sql);
       
      // Release the connection back to the pool
      connection.release();
      res.json({ message: 'Data inserted successfully.' });
      res.redirect('/');
    } catch (error) {
      console.error('Error executing INSERT query:', error);
      res.status(500).json({ error: 'An error occurred while inserting data.' });
    }
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});