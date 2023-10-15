const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const token = require('./token');

const app = express();
const port = 3000;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }));

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'exo_express',
};
let taches = [];
// Establish a database connection pool
const pool = mysql.createPool(dbConfig);
// Home
app.get('/',function(req, res){
  try{
    res.render('index.ejs',{name:taches});

  }catch(error){

  }
 });
// Route for SELECT query

app.get('/tous_les_taches',/*token,*/ async (req, res) => {
  try {
    // Acquire a connection from the pool
    const connection = await pool.getConnection();

    // Execute a SELECT query

    const [rows] = await connection.execute('SELECT * FROM taches');
    taches = rows;
    console.log(taches);
    // Release the connection back to the pool
    connection.release();
    res.render('index.ejs',{name:taches});

    res.json(rows); // Send the query result as JSON
  } catch (error) {
    console.error('Error executing SELECT query:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});


//récupérer la liste de toutes les tâches non faites
app.get('/taches_non_terminees',/*token,*/ async (req, res) => {
    try {
      // Acquire a connection from the pool
      const connection = await pool.getConnection();
  
      // Execute a SELECT query
  
      const [rows] = await connection.execute('SELECT * FROM `taches` WHERE isDone = "false"');
  
      // Release the connection back to the pool
      connection.release();
      taches = rows;
      res.render('index.ejs',{name:taches});
      res.json(rows); // Send the query result as JSON
    } catch (error) {
      console.error('Error executing SELECT query:', error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  });
  //Ajouter une nouvelle tâche
// Route for INSERT query
app.post('/insert',/*token,*/async (req, res) => {
  try {
    let { nomTache, dueDate, isDone} = req.body;

    // Acquire a connection from the pool
    const connection = await pool.getConnection();
    /*nomTache="tache numero 4";
    dueDate="2023-05-07";
    isDone="true";*/
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0'); 
    const day = new Date().getDate().toString().padStart(2, '0');

    dueDate = `${year}-${month}-${day}`;
    isDone = isDone== "on"? "true" : "false";
    // Execute an INSERT query
    let sql = 'INSERT INTO taches (name, dueDate, isDone) VALUES (?,?,?)'
    await connection.execute(sql, [nomTache, dueDate, isDone]);
    
    // Release the connection back to the pool
    //connection.release();
    
    res.json({ message: 'Data inserted successfully.' });
    res.redirect('/');
  } catch (error) {
    console.error('Error executing INSERT query:', error);
    res.status(500).json({ error: 'An error occurred while inserting data.' });
  }
});
//Marquer une tâche à done
// Route for Update une tache à Done query
app.post('/update_done/:id',/*token,*/ async (req, res) => {
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
app.post('/update_tache/:id',/*token,*/ async (req, res) => {
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
      res.render('index.ejs',{name:taches});

      res.json({ message: 'Data inserted successfully.' });
      res.redirect('/');
    } catch (error) {
      console.error('Error executing INSERT query:', error);
      res.status(500).json({ error: 'An error occurred while inserting data.' });
    }
  });
    // Supprimer une tâche (bonus)
// Route for Delete une tache query
app.post('/delete_tache/:id',/*token,*/ async (req, res) => {
    try {
      const id_tache = req.params.id;
      // Acquire a connection from the pool
      const connection = await pool.getConnection();
    
      // Execute an Delete query
      let sql = `DELETE FROM taches WHERE id_tache =${id_tache}`
      await connection.execute(sql);
       
      // Release the connection back to the pool
      //connection.release();
      /*res.render("index.ejs", {
        id: id_tache
    })*/
      res.json({ message: 'Data inserted successfully.' });
      //res.redirect('/');
    } catch (error) {
      console.error('Error executing INSERT query:', error);
      res.status(500).json({ error: 'An error occurred while inserting data.' });
    }
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});