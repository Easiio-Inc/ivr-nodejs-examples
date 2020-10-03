//////////////////////////////////////////////////////////////////
// Easiio, Inc, Call Center https://www.easiio.com
// Sample code to send SMS via twilio. This could be use with Easiio
// IVR or ITR with Twilio API including SMS and other.
// Please see article: https://www.easiio.com/wiki/nodejs_twilio_sms
///////////////////////////////////////////////////////////////////

const http = require('http');

var url = require( "url" );
var queryString = require( "querystring" );
var redis = require('redis');
var redisClient = redis.createClient(); // default setting.

const accountSid = 'AC49ab903dxxxxxxxxxxxxxxx';  // replace with your accountid
const authToken = 'a4809c9e4000000000000000000000';  // replace with your token

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

        const client = require('twilio')(accountSid, authToken);

        client.messages
          .create({
             body: 'This is confirmed message of your order has been placed. comfirmation number: ' + number,
             from: '8664607666',
             to: formData.from
           })
          .then(message => console.log(message.sid));
        response.write('[ { "id": 1, "action": "play", "text": "The confirmation message send via sms: ' + number + '" }]');
        response.end('');
      });
    } else if (request.url === "/send_verification_code_itr") {
      var requestBody = '';
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
        console.log("send sms twilio phone: ", formData.phone);
        const client = require('twilio')(accountSid, authToken);

        redisClient.set(formData.phone,number);
        redisClient.expire(formData.phone,600); // setting expiry for 10 minutes.

        client.messages
          .create({
             body: 'Your Easiio verification code: ' + number,
             from: '+15614492296',
             to: formData.phone
           })
          .then(message => console.log(message.sid));
        response.write('[ { "id": 1, "action": "play", "text": "The varification code send via sms: ' + number + '" }]');
        response.end('');
      });
    } else if (request.url === "/check_varification_code") {
      var requestBody = '';
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

        console.log("post end code: ", formData.code, " phone: ", formData.phone);

        var code = redisClient.get(formData.phone,function(err,reply) {

          if(err) {
            console.log ("Error in redis.");
            response.write('[ { "id": 1, "action": "play", "text": "Error in redis.' + queryObject.code + '" }]');
            response.end('');
            //return callback(true,"Error in redis");
          }
          if(reply === null) {
            console.log ("Invalid email address.");
            response.write('[ { "id": 1, "action": "play", "text": "Invalid email address: ' + email + '" }]');
            response.end('');
            return 1;
            //return callback(true,"Invalid email address");
          }
          return_code = reply;
          console.log ("email check return_code:." + reply);
          if (return_code == formData.code) {
            console.log("verification successful. ", formData.phone, " ", return_code);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('<!doctype html><html><head><title>email verification successful</title></head><body>email verification successful</body></html>');
            response.end();

          } else {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('<!doctype html><html><head><title>email verification failed</title></head><body>email verification failed. Please try again</body></html>');
            response.end();
            console.log("verification failed. correct code: ", formData.code, ", failed code: ", return_code);

          }
          
        });

        
        
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
