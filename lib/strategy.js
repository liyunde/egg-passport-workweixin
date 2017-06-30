const util = require('util'),
  OAuth2Strategy = require('passport-oauth2'),
  localOauth2 = require('./oauth2'),
  querystring= require('querystring')

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
  this._appid = options.clientID;
  this._secret = options.clientSecret;

  this._authorizationURL = options.authorizationURL;
  // hack for weixin
  this.authenticate = localOauth2.authenticate;
  this._loadUserProfile = localOauth2._loadUserProfile;

  this._oauth2.getOAuthAccessToken = function (code, params, callback) {
    callback(null, code)
  }
}

util.inherits(Strategy, OAuth2Strategy);

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

Strategy.prototype.authorizationParams = function(options){
  options.appid = this._appid;
  if(this._requireState && !options.state){
    throw new Error('Authentication Parameter `state` Required');
  }else{
    return options;
  }
};

Strategy.prototype.userProfile = function (authCode, done) {
  done(null, {code: authCode})
}

module.exports = Strategy

