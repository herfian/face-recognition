const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',   
    connection: {
      host : '127.0.0.1',
      user : 'herfian',
      password : '',
      database : 'smart-brain'
    }
    });

console.log(db.select('*').from('users'));

const app = express();

const database = {
    users: [
        {
            id: '001',
            name: 'Andy',
            email: 'andy16@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '002',
            name: 'Jane',
            email: 'jane17@gmail.com',
            password: 'bigbang',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res)=>{
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // bcrypt.compare("supreme", '$2a$10$z65zo6Br7CefaVJsqt/FgeNrZHIy9uDkgHuFrR2Kk3tbKNJTktEiG', function(err, res) {
    //     console.log('first guess', res)
    // });
    // bcrypt.compare("veggies", '$2a$10$z65zo6Br7CefaVJsqt/FgeNrZHIy9uDkgHuFrR2Kk3tbKNJTktEiG', function(err, res) {
    //     console.log('second guess', res)
    // });
    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
    res.json('success');
    }else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
    })
    .then(users => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

// Load hash from your password DB.


app.listen(3000, ()=> {
    console.log('app is running');
})