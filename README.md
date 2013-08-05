# Authorize.net Request

## Install

    npm install auth-net-request

## Usage

```js
var AuthorizeRequest = require('auth-net-request');

var Request = new AuthorizeRequest({
  api: '123',
  key: '1234',
  sandbox: false // true
});

Request.send(<method>, <xml>, [xmlOptions], function(err, response) {});
```
