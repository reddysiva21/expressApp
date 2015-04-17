/**
 * Created by siva on 4/14/2015.
 */

// setup
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

// configuration
mongoose.connect('mongodb://localhost/local');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

// TODO model creation
var Todo = mongoose.model('Todo', {
    text: String
});

// Routes configuration
// get all todos
app.get('/api/todos', function(req, res){
    Todo.find(function(err, todos) {
        if(err) res.send(err);
        res.send(todos);
    });
});
// create one todo and send back all todos after creation.
app.post('/api/todos', function(req, res) {
    Todo.create({
        text: req.body.text,
        done: false
    },function(err, todo) {
        if(err) res.send(err);
        Todo.find(function(err, todos){
            if(err) res.send(err);
            res.json(todos);
        });
    });
});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res){
    Todo.remove({
        _id: req.params.todo_id
    }, function(err, todo){
        if(err) res.send(err);
        Todo.find({}, function(err, todos) {
            if(err) res.send(err);
            res.json(todos);
        });
    });
});

// application front-end handler
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

// listen (start app with node server.js)
app.listen(3000);
console.log('Listening on the port: 3000......');