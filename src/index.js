const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => username === user.username)

  if (user){
    request.user = user;
    return next()
  } else {
    return response.status(400).json({error: "username not exists"})
  } 
}

app.post('/users', (request, response) => {
  const {username, name} = request.body;

  const customerAlreadyExists = users.some((user) => user.username == username);

  if (customerAlreadyExists){
    return response.status(400).json({error: "username already in use"})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const todos = user.todos;
  return response.json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {user} = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {id} = request.params
  const {user} = request

  const {title, deadline} = request.body;

  const todo = user.todos.find((todo) => todo.id == id)

  if (!todo) {
    return response.status(404).json({error: "todo not found"})
  }

  todo.title = title
  todo.deadline = deadline

  return response.json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;