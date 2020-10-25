//////////////////////////////////////////////////////////////////
// Easiio, Inc, Call Center https://www.easiio.com
// Sample code to send email. This could be use with Easiio
// IVR or ITR with cloudmainin API.
// 
///////////////////////////////////////////////////////////////////

const http = require('http');

var url = require( "url" );
var queryString = require( "querystring" );

"use strict";

var formOutput = '<html><body>'
  + '<h1>Zendesk support ticket example</h1>'
  + 'Please use post for the API request.</body></html>';

const server = http.createServer(function (request, response) {
  try {
   if(request.method === "GET") {
    console.log ("Get request url ." + request.url );
    if (request.url === "/favicon.ico") {
      response.writeHead(404, {'Content-Type': 'text/html'});
      response.write('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
      response.end();
    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(formOutput);
    }
  } else if(request.method === "POST") {
    if (request.url.indexOf ("/zendesk_ticket_create") >=0 ) {
      var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if(requestBody.length > 1e7) {
          response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      
      request.on('end', function() {
        console.log("post info:", requestBody);
        var formData = JSON.parse( requestBody );
        
        if (formData == null || formData.subject == null  || formData.comment == null) {
          response.write('[ { "id": 1, "action": "play", "text": "missing subject or comment" }]');
          response.end('');
          return;
        }

        var request1 = require("request");

        var queryObject = url.parse(request.url,true).query;
        if (queryObject == null || queryObject.user == null || queryObject.pass == null) {
          console.log("zendesk 1.0.1 request url missing username or password");
          response.write('[ { "id": 1, "action": "play", "text": "The zendesk create ticket failed request url missing username or password" }]');
          response.end('');
          return 0;
        }
        var remoteurl = "https://" + queryObject.user + ":" + queryObject.pass + "@" + queryObject.domain + ".zendesk.com/api/v2/tickets.json";

        var options = {
            method: 'POST',
            url: remoteurl,
            headers: {accept: 'application/json', 'content-type': 'application/json'},
            body: {
              "ticket":
                {
                  "subject": formData.subject,
                  "comment": {
                    "body": formData.comment
                  }
                }
              },
            json: true
          };

          request1(options, function (error, response1, body) {
            if (error) throw new Error(error);
            if (body != null && body.ticket != null && body.ticket.id != null)
            {
              console.log("result", body.ticket.id);
              response.write('[ { "id": 1, "action": "play", "text": "The zendesk create ticket successful ticket number: ' + body.ticket.id+ '" }]');
            }
            response.end('');
            console.log(body);
          });

        function handleError(err) {
            console.log(err);
            process.exit(-1);
        }
      
      });
    } 
    
  } else {
    response.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    return response.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
  }
  } catch (err){
    console.log(err);
  }
});

const port = process.env.PORT || 1341;
server.listen(port);

console.log("Server running at http://localhost:%d", port);