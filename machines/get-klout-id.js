module.exports = {
  friendlyName: 'Get Klout id',
  description: 'Get the Klout Id from a Twitter screen name.',
  extendedDescription: '',
  inputs: {
    twitterScreenName: {
      example: 'tuneyards',
      description: 'The Twitter screen name of Klout Id',
      required: true
    },
    apiKey: {
      example: 'ODUfdisauPUdufsoUSF',
      description: 'Your Klout API key.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    wrongOrNoKey: {
      description: 'Invalid or unprovided API key. All calls must have a key.'
    },
    success: {
      description: 'Returns a Klout ID.',
      example: '234234239472379'
    }
  },
  fn: function(inputs, exits) {

    var URL = require('url');
    var QS = require('querystring');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    var it = 'http://api.klout.com/v2/identity.json/twitter?screenName=' + inputs.twitterScreenName + '&key=' + inputs.apiKey;
    console.log(it);

    Http.sendHttpRequest({
      baseUrl: it,
      url: '',
      method: 'get',
    }).exec({
      // OK.
      success: function(result) {

        try {
          var responseBody = JSON.parse(result.body);
        } catch (e) {
          return exits.error('An error occurred while parsing the body.');
        }

        return exits.success(responseBody.id);

      },
      // Non-2xx status code returned from server
      notOk: function(result) {

        try {
          if (result.status === 403) {
            return exits.wrongOrNoKey("Invalid or unprovided API key. All calls must have a key.");
          }
        } catch (e) {
          return exits.error(e);
        }

      },
      // An unexpected error occurred.
      error: function(err) {

        exits.error(err);
      },
    });
  },
};