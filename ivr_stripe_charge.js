//////////////////////////////////////////////////////////////////
// Easiio, Inc, Call Center https://www.easiio.com
// Sample code to use IVR and DTMF for charging a crediting card
// with stripe 
// Please see article: https://www.easiio.com/wiki/nodejs_ivr_stripe_charge
///////////////////////////////////////////////////////////////////

const http = require('http');

var url = require( "url" );
var queryString = require( "querystring" );


var sess = {};
let tokenStore = {};

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
    if (request.url === "/card_number") {
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
        sess.card_number = formData.dtmf;
        console.log("post end 1.0", formData, " ", formData.dtmf, " ",  formData.from, " ", sess.card_number);
        
        response.writeHead(200, {'Content-Type': 'text/json'});

        response.write('[ { "id": 1, "action": "play", "text": "Credit card number saved." }]');
        response.end('');

      });
    } else if (request.url === "/expiration_date") {
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
        
        sess.expiration = formData.dtmf;
        console.log("post end 1.0", formData.dtmf , " ", formData.from, " ", sess.expiration);
        
        response.write('[ { "id": 1, "action": "play", "text": "expiration_date is saved" }]');
        response.end('');
      });
    } else if (request.url === "/security_code") {
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
        sess.cvc = formData.dtmf;
        console.log("post end 1.0", sess.cvc , " ", formData.from, " ", sess.expiration, " ", sess.card_number);
        // replace this with the stripe ID 
        var stripe = require('stripe')('sk_test_wfl5DAkrvU4IpqUT9uFWlB000000000000');
        stripe.paymentMethods.create(
        {
            type: 'card',
            card: {
              number: sess.card_number,
              exp_month: sess.expiration.substr(0,2),
              exp_year: '20' + sess.expiration.substr(2,2),
              cvc: sess.cvc,
            },
          },
          function(err, paymentMethod) {
           console.log("payment method call back:", err, " ", paymentMethod);
            // asynchronously called
          }
        );

        // this is create a charge.
        // var stripe = require('stripe')('sk_test_wfl5DAkrvU4IpqUT9uFWl0000000000000');

        // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
        // stripe.charges.create(
        //   {
        //     amount: 100,
        //     currency: 'usd',
        //     source: 'tok_visa',
        //     description: 'My First Test Charge (created for API docs)',
        //   },
        //   function(err, charge) {
        //    console.log("charge call back", charge);
        //     // asynchronously called
        //   }
        // );
        response.write('[ { "id": 1, "action": "play", "text": "hello payment balance of 100 is charged. Thank you for your payment. Good bye." }]');
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

console.log("Server running at http://localhost:%d", port);
