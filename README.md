# Authorize.net Request [![Dependency Status](https://david-dm.org/durango/authorize-net-request.png)](https://david-dm.org/durango/authorize-net-request)

## Install

    npm install auth-net-request

## Usage

```js
var AuthorizeRequest = require('auth-net-request');

var Request = new AuthorizeRequest({
  api: '123',
  key: '1234',
  cert: '/path/to/cert.pem',
  sandbox: false // true
});

Request.send(<method>, <xml>, [xmlOptions], function(err, response) {});
```
