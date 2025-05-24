// Create web server

const http = require('http');
const PORT = 3000;

// Sample comments data
let comments = [
  { id: 1, user: 'Alice', text: 'Hello, world!' },
  { id: 2, user: 'Bob', text: 'Nice to meet you.' }
];

// Helper to send JSON response
function sendJSON(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/comments') {
    // Return all comments
    sendJSON(res, comments);
  } else if (req.method === 'POST' && req.url === '/comments') {
    // Add a new comment
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { user, text } = JSON.parse(body);
        if (!user || !text) {
          sendJSON(res, { error: 'Missing user or text' }, 400);
          return;
        }
        const newComment = { id: comments.length + 1, user, text };
        comments.push(newComment);
        sendJSON(res, newComment, 201);
      } catch (e) {
        sendJSON(res, { error: 'Invalid JSON' }, 400);
      }
    });
  } else {
    // Not found
    sendJSON(res, { error: 'Not found' }, 404);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

