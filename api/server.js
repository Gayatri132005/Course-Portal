const http = require('http');
const app = require('./app'); // Importing app.js
require('dotenv').config();
console.log(process.env.SECRET_KEY);
const port = process.env.PORT || 4200;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`App is running on port ${port}...`);
});
