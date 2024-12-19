const axios = require('axios');

exports.handler = async function (context, event, callback) {
  const customerID = event.customerID;
  console.log('customerID: ', customerID);

  // Create a custom Twilio Response
  // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers: responseHeaders,
      body: '',
    });
  }

  if (!customerID) {
    console.log('customerID is missing');
    response.appendHeader('Content-Type', 'plain/text');
    response.setBody('Bad Request: customerID is required.');
    response.setStatusCode(400);
    return callback(null, response);
  }

  try {
    const dealApiResponse = await axios.get(
      'https://webhook.site/8dfe0f22-8d5d-4d41-b5f2-c5f0d30a8e76',
      {
        params: {
          customerID: customerID,
        },
      }
    );
    const customerDeals = dealApiResponse.data.find(
      (d) => d.customerID === customerID
    );

    if (customerDeals) {
      console.log('deals found: ', customerDeals.deals);
      response.appendHeader('Content-Type', 'application/json');
      response.setBody({
        deals: customerDeals.deals,
      });
      // Return a success response using the callback function.
      return callback(null, response);
    } else {
      console.log('deals not found for customerID:', customerID);
      response.appendHeader('Content-Type', 'plain/text');
      response.setBody('Customer ID not found.');
      response.setStatusCode(404);

      // If there's an error, send an error response
      // Keep using the response object for CORS purposes
      return callback(null, response);
    }
  } catch (error) {
    console.error('Error: ', error.message);
    response.appendHeader('Content-Type', 'plain/text');
    response.setBody(error.message);
    response.setStatusCode(500);

    // If there's an error, send an error response
    // Keep using the response object for CORS purposes
    return callback(null, response);
  }
};
