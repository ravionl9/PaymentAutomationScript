const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./mongoose');
const UserController = require('./controllers/UserController');
const ScriptController = require('./controllers/ScriptController');

const PORT = 7800;

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db = mongoose();

// app.use(express.static(__dirname, '/public'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send('sbi script backend!!');
});

app.post('/login', (req, res) => {
    let userObj = new UserController(req, res);
    return userObj.login();
});

app.post('/start_script', (req, res) => {
    let scriptObj = new ScriptController(req, res);
    return scriptObj.startScript();
});

app.post('/logout', (req, res) => {
    let userObj = new UserController(req, res);
    return userObj.logout();
});

server.timeout = 360000;

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
