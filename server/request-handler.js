/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

// /classes/messages
var time = new Date();

var uniqueID = 0;
var generateUniqueID = function() {
  var currentUniqueID = uniqueID;
  uniqueID += 1;
  return currentUniqueID;
};

var dataArray = [];

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;
  var method = request.method;
  var url = request.url;
  var statusCode = 404;

  headers['Content-Type'] = 'application/json';

  if (method === 'GET' && url.includes('/classes/messages')) {

    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(dataArray));
  } else if (request.method === 'POST' && url.includes('/classes/messages')) {
    statusCode = 201;
    var body = [];
    request.on('data', (chuck) => {
      body.push(chuck);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      body = JSON.parse(body);
      body.uniqueID = generateUniqueID();
      body.createdAt = new Date();
      body.roomname = 'lobby';
      dataArray.push(body);
      response.writeHead(statusCode, headers);
      response.end('Got it!');
      console.log(dataArray);
    });
  } else if (request.method === 'OPTIONS' && url.includes('/classes/messages')) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(dataArray));
  } else {
    response.writeHead(statusCode, headers);
    response.end();
  }
};

exports.requestHandler = requestHandler;

