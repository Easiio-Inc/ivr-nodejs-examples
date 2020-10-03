//////////////////////////////////////////////////////////////////
// Easiio, Inc, Call Center https://www.easiio.com
// Sample code to send email via cloudminin. This could be use with Easiio
// IVR or ITR with cloudminin API.
// 
///////////////////////////////////////////////////////////////////

const http = require('http');

var url = require( "url" );
var queryString = require( "querystring" );

var sess = {};
"use strict";
const nodemailer = require("nodemailer");

var formOutput = '<html><body>'
  + '<h1>XYZ Repository Commit Monitor</h1>'
  + '<form method="post" action="inbound" enctype="application/x-www-form-urlencoded"><fieldset>'
  + '<div><label for="UserName">User Name:</label><input type="text" id="UserName" name="UserName" /></div>'
  + '<div><label for="Repository">Repository:</label><input type="text" id="Repository" name="Repository" /></div>'
  + '<div><label for="Branch">Branch:</label><input type="text" id="Branch" name="Branch" value="master" /></div>'
  + '<div><input id="ListCommits" type="submit" value="List Commits" /></div></fieldset></form></body></html>';

async function sendMail(email, name) {
  let hostname = "xxxxx.cloudmta.net";  // replace with your cloudmailin account hostname.
  let username = "12b20000000000";  // replace with your cloudmailin account username
  let password = "74SSvuFbJ00000000000000";  // replace with your cloudmailin account password

  let transporter = nodemailer.createTransport({
    host: hostname,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: username,
      pass: password,
    },
    logger: true
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Sender Name" <jian.lin@easiio.com>',
            to: email,
            subject: "Your request is here",
            
            html: "Hi, " + name + ",<br>" + "This is easiio promotion link<br>" + "<strong>Coupon code:7jhsk8</strong>",
            headers: { 'x-cloudmta-class': 'standard' }
  });

  console.log("Message sent: %s", info.response);
}

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
    if (request.url === "/send_email_cloudmailin") {
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
        console.log("send email post: ", formData.name , " ", formData.email, " ", formData.message);
      
        sendMail (formData.email, formData.name);
          response.write('[ { "id": 1, "action": "play", "text": "The notification email send via cloudmailin: ' + number + '" }]');
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
