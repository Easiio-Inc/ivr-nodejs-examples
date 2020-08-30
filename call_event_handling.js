//////////////////////////////////////////////////////////////////
// Easiio, Inc, https://www.easiio.com
// Sample code to handle the call event in Easiio phone system and 
// contact center. Each call will generate corresponding events and 
// can be configured to send to Nodejs for processing.
// Please see article: https://www.easiio.com/wiki/nodejs_call_event_handling
///////////////////////////////////////////////////////////////////

const http = require('http');

var url = require( "url" );
var queryString = require( "querystring" );

const bodyParser = require("body-parser");

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
    if (request.url === "/call_event_ring") {
      var requestBody = '';
      console.log("post call_event_ring 1.0");
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
        // Add code here to handling these call info. It maybe a API call to other applications.
        console.log("post end 1.0", formData.caller , " ", formData.called, " ", formData.event);
        response.write('[]');
        response.end('');
      });
    } else if (request.url === "/call_event_general") {
      var requestBody = '';
      const queryObject = url.parse(request.url,true).query;
      console.log(queryObject);
      console.log("post call_event_answer 1.0");
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
        // if (queryObject.crm == 'hubspot') {
        //      process_hubspot_event (queryObject, formData);
        // } else if (queryObject.crm == 'salesforce') {
        //      process_salesforce_event (queryObject, formData);
        // } 

        // Add code here to handling these call info. It maybe a API call to other applications.
        console.log("post end 1.0", formData.caller , " ", formData.called, " ", formData.event);
        response.write('[]');
        response.end('');
      });
    } 

    else if (request.url === "/call_event_answer") {
      var requestBody = '';
      console.log("post call_event_answer 1.0");
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

        // Add code here to handling these call info. It maybe a API call to other applications.
        console.log("post end 1.0", formData.caller , " ", formData.called, " ", formData.event);
        response.write('[]');
        response.end('');
      });
    } else if (request.url === "/call_event_hangup") {
      var requestBody = '';
      console.log("post call_event_hangup 1.0");
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

        // Add code here to handling these call info. It maybe a API call to other applications.
        console.log("post end 1.0", formData.caller , " ", formData.called, " ", formData.event);
        response.write('[]');
        response.end('');
      });
    } else {
    response.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    return response.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
  }
 }
	
});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Easiio call center call event handling server running at http://localhost:%d", port);
