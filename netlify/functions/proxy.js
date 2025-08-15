// File: netlify/functions/proxy.js
const axios = require('axios');

exports.handler = async function (event, context) {
  // Get the 'url' parameter from the request
  const { url } = event.queryStringParameters;

  // If no URL is provided, return an error
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' }),
    };
  }

  try {
    // Decode the URL and make a request to it using axios
    const response = await axios.get(decodeURIComponent(url), {
      headers: { 'Accept': 'application/json' },
      // Set a 10-second timeout for the request
      timeout: 10000,
    });

    // If successful, return the data from the external API
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allows any website to use this proxy
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    // If there's an error, return a relevant error status
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: 'Failed to fetch the requested URL.' }),
    };
  }
};