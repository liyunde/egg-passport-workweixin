const util = require('util'),
  OAuth2Strategy = require('passport-oauth2')

function Strategy(options, verify) {
  options = options || {}
  options.authorizationURL = options.authorizationURL || 'https://open.weixin.qq.com/connect/oauth2/authorize'
  options.scopeSeparator = options.scopeSeparator || ','
  options.customHeaders = options.customHeaders || {}
  options.tokenURL = 'empty'
  options.profileURL = options.profileURL || 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo'
  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-workweixin'
  }

  OAuth2Strategy.call(this, options, verify)
  this.name = 'workweixin'
  this.appid = options.clientID;
  this.secret = options.clientSecret;

  this._oauth2.getOAuthAccessToken = function (code, params, callback) {
    callback(null, code)
  }
}

util.inherits(Strategy, OAuth2Strategy)

Strategy.prototype.getAuthorizeUrl = function (params) {
  var queries = [];
  // add all necessary params by order here
  var order = ['appid', 'redirect_uri', 'response_type', 'scope', 'agentid', 'state'];
  order.forEach(function (key) {
    if (params[key]) {
      var query = {};
      query[key] = params[key];
      queries.push(querystring.stringify(query));
    }
  });
  return this._authorizationURL + '?' + queries.join('&');
};

Strategy.prototype.userProfile = function (authCode, done) {
  done(null, {code: authCode})
}

module.exports = Strategy

