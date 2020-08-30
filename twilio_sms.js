//////////////////////////////////////////////////////////////////
// Easiio, Inc, Call Center https://www.easiio.com
// Sample code to send SMS via twilio. This could be use with Easiio
// IVR or ITR with Twilio API including SMS and other.
// Please see article: https://www.easiio.com/wiki/nodejs_twilio_sms
///////////////////////////////////////////////////////////////////

const http = require('http');

var url = require( "url" );
var queryString = require( "querystring" );

var sess = {};

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
    if (request.url === "/send_sms_twilio") {
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
        var number = Math.floor(Math.random() * 899999 + 100000);
        console.log("send sms twilio post end 1.0", formData.dtmf , " ", formData.from, " ", sess.expiration, " ", sess.card_number);
        // Download the helper library from https://www.twilio.com/docs/node/install
        // Your Account Sid and Auth Token from twilio.com/console
        // DANGER! This is insecure. See http://twil.io/secure
        const accountSid = 'AC49ab903d43fa67ab675xxxxxxxxxxxxxx';
        const authToken = 'a4809c9e4e09e140e07440000000000000';
        const client = require('twilio')(accountSid, authToken);

        client.messages
          .create({
             body: 'This is confirmed message of your order has been placed. comfirmation number: ' + number,
             from: '+15614492296',
             to: formData.from
           })
          .then(message => console.log(message.sid));
        response.write('[ { "id": 1, "action": "play", "text": "The confirmation message send via sms: ' + number + '" }]');
        response.end('');
      });
    } 
    
  } else {
    response.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    return response.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
  }

});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
