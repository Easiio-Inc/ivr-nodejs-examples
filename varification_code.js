//////////////////////////////////////////////////////////////////
// Easiio, Inc, https://www.easiio.com
// Sample of using nodejs to generate a verification to show on IVR or
// ITR. 
// Please see article: https://www.easiio.com/wiki/nodejs_varification_code
///////////////////////////////////////////////////////////////////

const http = require('http');

var url = require( "url" );
var queryString = require( "querystring" );

var sess = {};
let tokenStore = {};

// var JSON = require( "JSON" );
var formOutput = '<html><body>'
  + '<h1>XYZ Repository Commit Monitor</h1>'
  + '<form method="post" action="inbound" enctype="application/x-www-form-urlencoded"><fieldset>'
  + '<div><label for="UserName">User Name:</label><input type="text" id="UserName" name="UserName" /></div>'
  + '<div><label for="Repository">Repository:</label><input type="text" id="Repository" name="Repository" /></div>'
  + '<div><label for="Branch">Branch:</label><input type="text" id="Branch" name="Branch" value="master" /></div>'
  + '<div><input id="ListCommits" type="submit" value="List Commits" /></div></fieldset></form></body></html>';


const server = http.createServer(function (request, response) {

  if(request.method === "GET") {
    if (request.url === "/favicon.ico") {
      response.writeHead(404, {'Content-Type': 'text/html'});
      response.write('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
      response.end();
    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(formOutput);
    }
  } else if(request.method === "POST") {
    if (request.url === "/get_varification_code") {
      var requestBody = '';
      console.log("post inbound 1.0");
      request.on('data', function(data) {
        requestBody += data;
        if(requestBody.length > 1e7) {
          response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      request.on('end', function() {
        console.log("post end", requestBody);
        var formData = JSON.parse( requestBody );
        //console.log("post end 1.0", formData.dtmf , " ", formData.from, " ", sess.expiration, " ", sess.card_number);
        var number = Math.floor(Math.random() * 899999 + 100000);
        sess.verification = number;
        response.write('[ { "id": 1, "action": "play", "text": "Your verification code is:' + number + '"}]');
        response.end('');
      });
    } else if (request.url === "/check_varification_code") {
      var requestBody = '';
      console.log("post inbound 1.0");
      request.on('data', function(data) {
        requestBody += data;
        if(requestBody.length > 1e7) {
          response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      request.on('end', function() {
        console.log("post end", requestBody);
        var formData = JSON.parse( requestBody );

        console.log("post end 1.0: ", formData.code);
        if (formData.code == sess.verification)
        {
          response.write('[ { "id": 1, "action": "play", "code":"success", "text": "Your verification code is correct:' + formData.code + '"}]');
          response.end('');
        } else {
          response.write('[ { "id": 1, "action": "play", "code":"failure", "text": "Your verification code is incorrect:' + formData.code + '"}]');
          response.end('');
        }
        
      });
    } else {
    response.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    return response.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
  }}
});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
