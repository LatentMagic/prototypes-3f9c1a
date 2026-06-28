'use strict';

// Zero-dependency static file server for the LatentPulse prototype console.
// Serves the repo over http so each prototype's babel-standalone runtime can
// XHR-fetch its app/*.jsx files (file:// fails on CORS).

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4321;
const HOST = '127.0.0.1';
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.jsx': 'text/javascript',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};
const TEXT_TYPES = new Set([
  'text/html',
  'text/css',
  'image/svg+xml',
  'text/javascript',
  'application/json',
]);
const DEFAULT_MIME = 'application/octet-stream';

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || DEFAULT_MIME;
  return TEXT_TYPES.has(type) ? `${type}; charset=utf-8` : type;
}

function send(res, status, body, headers) {
  res.writeHead(status, headers || {});
  res.end(body);
}

const server = http.createServer((req, res) => {
  // Strip query/hash, then decode percent-escapes BEFORE the fs lookup so
  // any percent-encoded path segment resolves to the real file on disk.
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  } catch (err) {
    send(res, 400, 'Bad Request', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }

  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  // Resolve against ROOT and confine: reject anything escaping the repo root.
  const resolved = path.resolve(ROOT, '.' + urlPath);
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
    send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }

  fs.stat(resolved, (err, stats) => {
    if (err || !stats.isFile()) {
      send(res, 404, 'Not Found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }
    fs.readFile(resolved, (readErr, data) => {
      if (readErr) {
        send(res, 500, 'Internal Server Error', { 'Content-Type': 'text/plain; charset=utf-8' });
        return;
      }
      send(res, 200, data, { 'Content-Type': contentType(resolved) });
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log('Prototype console → http://localhost:4321');
});
