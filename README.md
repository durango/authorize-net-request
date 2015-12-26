# Authorize.net Request

[![Dependency Status](https://david-dm.org/durango/authorize-net-request.svg?theme=shields.io)](https://david-dm.org/durango/authorize-net-request) [![devDependency Status](https://david-dm.org/durango/authorize-net-request/dev-status.svg?theme=shields.io)](https://david-dm.org/durango/authorize-net-request#info=devDependencies)

## Install

    npm install auth-net-request

## Usage

```js
var AuthorizeRequest = require('auth-net-request');

var Request = new AuthorizeRequest({
  api: '123',
  key: '1234',
  cert: '/path/to/cert.pem',
  rejectUnauthorized: false, // true
  requestCert: true, // false
  agent: false // http.agent object
  sandbox: false // true
});

Request.send(<method>, <xml>, [xmlOptions], function(err, response) {});
```

## Args and Options

* `<method>` - As specified in the Auhorize.net API without the "Request" 
suffix, e.g. "createTransaction".
* `<xml>` - Either an XML string or a JavaScript object reflecting the JSON 
specification in the Authorize.net API.
* `xmlOptions.rejectUnauthorized` - see `https.request` option. 
Note: defaults to `false`. Likely want to set to `true`.
* `xmlOptions.requestCert` - Defaults to `true`.
* `xmlOptions.agent` - Defaults to `false`.
* `xmlOptions.extraOptions` - Adds an `<extraOptions>` tag to the request. For?

## Err and Response

If `!err` on the `send` method callback, `response` is as specified in the 
Authorize.net API.  E.g. consider checking and recording 
`response.transactionResponse.responseCode`, 
`response.transactionResponse.authCode` and 
`response.transactionResponse.transId`.

If `!!err` on the `send` method callback, you can get access to the 
following properties of `err`:
* `err.name`
* `err.message`
* `err.code`
* `err.stack`
* `err.response` - response from Authorize.net API, if the request 
got that far.

## Notes

`!err` on the `send` method callback does not necessarily mean a 
transaction was approved.  Note the differences among the following 
in the API documentation: `messages.resultCode`, 
`messages.message.code` and `transactionResponse.responseCode`.

Version `>= 2.x.x` has a breaking change, all values are returned as strings rather than strings and numbers (unless the value is an object, array, etc).

## References

* Authorize.net [API Reference](http://developer.authorize.net/api/reference/index.html)
* Authorize.net [Response Codes](http://developer.authorize.net/api/reference/responseCodes.html)
* Node.js [https.request](https://nodejs.org/api/https.html#https_https_request_options_callback)


