var https = require('https')
  , parser = require('xml2js')
  , fs = require('fs');

module.exports = (function() {
  var AuthorizeRequest = function(options) {
    options = options || {};
    this.sandbox = options.sandbox || false;
    this.api = options.api || '';
    this.key = options.key || '';
    this.cert = options.cert || '';

    if (!!this.cert) {
      this.cert = fs.readFileSync(this.cert);
    }

    this.LIVE_URL = {
      host: 'api.authorize.net',
      path: '/xml/v1/request.api'
    }
    this.SANDBOX_URL = {
      host: 'apitest.authorize.net',
      path: '/xml/v1/request.api'
    }
    this.validationMode = 'none';
    this.refId = '';
  }

   /**
   * @return string
   */
  AuthorizeRequest.prototype.getPostUrl = function() {
    return !!this.sandbox ? this.SANDBOX_URL : this.LIVE_URL;
  }

  AuthorizeRequest.prototype.send = function(action, xml, options) {
    var callback = arguments[arguments.length - 1], string = ''
      , originalValidationMode = this.validationMode; // In order to reset after the transaction

    options = options || {};

    // Rule set by Authorize
    if (action === "validateCustomerPaymentProfile") {
      this.validationMode = (!!this.sandbox ? 'testMode' : 'liveMode');
    }

    // Rule set by Authorize
    if (action === "createCustomerProfileRequest" && xml.match('/<payment>/') === null) {
      this.validationMode = 'none';
    }

    string = '<?xml version="1.0" encoding="utf-8"?><' + action + 'Request xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">';
    string += '<merchantAuthentication><name>' + this.api + '</name><transactionKey>' + this.key + '</transactionKey></merchantAuthentication>';
    if (!!this.refId) {
      string += '<refId>' + this.refId + '</refId>';
    }
    if (!!xml) {
      string += xml;
    }
    if (!!this.validationMode && this.validationMode !== "none") {
      string += '<validationMode>' + this.validationMode + '</validationMode>';
    }
    if (!!options && !!options.extraOptions) {
      string += '<extraOptions><![CDATA[' + options.extraOptions + ']]></extraOptions>';
    }
    string += '</' + action + 'Request>';

    this.validationMode = originalValidationMode; // Reset since we no longer need it to build the XML..

    var url = this.getPostUrl();

    var req = https.request({
      host: url.host,
      path: url.path,
      method: 'POST',
      cert: this.cert,
      rejectUnauthorized: options.rejectUnauthorized || false,
      requestCert: options.requestCert || true,
      agent: options.agent || false,
      headers: {
        'Content-Length': string.length,
        'Content-Type': 'text/xml'
      }
    });

    req.write(string);
    req.on('error', function(err) {
      callback(err);
    })
    .on('response', function(res) {
      if (!!res.connection.authorizationError) {
        return callback(new Error('Connection authorization error: ' + res.connection.authorizationError));
      }

      res.on('data', function(data) {
        data = data.toString();

        parser.parseString(data, {object: true, explicitArray: false}, function (err, response) {
          if (response.ErrorResponse) {
            return callback(new AuthNetError(response.ErrorResponse));
          }

          if (!response[action + 'Response']) {
            return callback(new Error('Unexpected response: ' + data));
          }


          var keys = Object.keys(response[action + 'Response']).filter(function(k) { return k !== 'xmlns:xsi' && k !== 'xmlns:xsd' && k !== 'xmlns'; })
            , length = keys.length
            , i = 0
            , values = {};

          for (i = 0; i < length; ++i) {
            values[keys[i]] = response[action + 'Response'][keys[i]];
          }

          var resultCode = values.messages.resultCode.toUpperCase();
          if (resultCode != "OK" && resultCode != "SUCCESS") {
            return callback(new AuthNetError(values));
          }

          callback(null, values);
        });
      });
    });

    req.end();
  };

  var AuthNetError = function(response) {
      this.message = 'Authorize.net error: ' + response.messages.message.text;
      this.code = response.messages.message.code;
      this.stack = (new Error()).stack;
  };
  AuthNetError.prototype = new Error();
  AuthNetError.prototype.name = 'AuthNetError';

  return AuthorizeRequest;
})();