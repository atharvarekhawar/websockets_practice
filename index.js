// Import required modules
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Load the Swagger YAML file
const swaggerDocument = YAML.load('./swagger.yaml');

// Serve the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Create an HTTP server using Express app
const server = http.createServer(app);

// Import and initialize Socket.IO
const { Server } = require('socket.io');
const io = new Server(server);

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Listen for 'user-message' event from clients
  socket.on('user-message', (message) => {
    // Broadcast the message to all connected clients
    io.emit('message', message);
  });
});

// Serve static files from the 'public' directory
app.use(express.static(path.resolve('./public')));

// Handle the root route
app.get('/', (req, res) => {
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Returns the homepage.
   *     responses:
   *       '200':
   *         description: OK
   *       '500':
   *         description: Internal Server Error
   */
  // Serve 'page1.html'
  res.sendFile(path.join(__dirname, 'public', 'page1.html'));
});

// Handle '/page2' route
app.get('/displayPage', (req, res) => {
   /**
   * @swagger
   * /page2:
   *   get:
   *     summary: Returns page 2.
   *     responses:
   *       '200':
   *         description: OK
   *       '500':
   *         description: Internal Server Error
   */
  // Serve 'page2.html'
  res.sendFile(path.join(__dirname, 'public', 'page2.html'));
});

// Start the server and listen on port 5000
server.listen(5000, () => {
  console.log('server started at 5000');
});
