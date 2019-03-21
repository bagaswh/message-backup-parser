/**
 * used for testing
 * printing data into client's console.log
 * since node's console.log isn't as interactive
 */

import { data } from './index';

const http = require('http');

const server = http.createServer((req: any, res: any) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  let response = '<script>console.log((' + JSON.stringify(data) + '));</script>';
  res.end(response);
});

server.listen(1337, '127.0.0.1');
