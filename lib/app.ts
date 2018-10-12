import * as ws from 'websocket';
import * as http from 'http';
import { readFileSync } from 'fs';
import { spawn } from 'child_process';

process.title = `log-streamer-${process.env.LOG_FILE}`;

const index = readFileSync('./lib/index.html');

/**
 * Global variables
 */
// latest 100 messages
let history = [];
// list of currently connected clients (users)
let clients = [];

/**
 * Send log line to all connected clients
 */
const sendLine = (line) => {
  history.push(line);
  history = history.slice(-100);
  clients.forEach((client) => {
    client.sendUTF(line);
  });
};

/**
 * HTML HTTP Server
 */
http.createServer(function (_request: http.IncomingMessage, response: http.ServerResponse) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end(index);
}).listen(4000);

/**
 * WebSocket HTTP server
 */
const sockServer = http.createServer();
sockServer.listen(3999);

/**
 * WebSocket server
 */
const wsServer = new ws.server({ httpServer: sockServer });

wsServer.on('request', function(request: ws.request) {
  const connection = request.accept(null, request.origin);

  // we need to know client index to remove them on 'close' event
  const i = clients.push(connection) - 1;

  // send the history
  history.forEach((line) => {
    connection.sendUTF(line);
  });

  // user disconnected
  connection.on('close', () => {
    // remove user from the list of connected clients
    clients.splice(i, 1);
  });
});

/**
 * Tail the log file
 */

const tail = () => {
  const proc = spawn('tail', ['-f', '-n', '100', process.env.LOG_FILE]);

  proc.stdout.on('data', sendLine);

  proc.stderr.on('data', (data) => {
    process.stdout.write(`stderr: ${data}`);
  });

  proc.on('close', () => {
    sendLine('\n\ntail exited... restarting in 5 seconds\n\n');
    history = [];
    setTimeout(tail, 5000);
  });
};

tail();
