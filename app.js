'use strict';

const debug = require('debug')('egg-passport-workweixin');
const assert = require('assert');
const Strategy = require('passport-weixin-enterprise-mobile').Strategy;

module.exports = app => {

  const config = app.config.passportWorkWeiXin;
  config.passReqToCallback = true;
  assert(config.key, '[egg-passport-workweixin] config.passportWorkWeiXin.key required');
  assert(config.secret, '[egg-passport-workweixin] config.passportWorkWeiXin.secret required');

  config.clientID = config.key;
  config.clientSecret = config.secret;

  config.requireState = false;

  app.passport.use('workweixin', new Strategy(config, (req, accessToken, refreshToken, params, profile, done) => {
    // format user
    const user = {
      provider: 'workweixin',
      id: profile.id,
      name: profile.username,
      displayName: profile.displayName,
      photo: profile.photos && profile.photos[0] && profile.photos[0].value,
      accessToken,
      refreshToken,
      params,
      profile,
    };

    // {
    //   "errcode": 0,
    //   "errmsg": "ok",
    //   "UserId":"USERID",
    //   "DeviceId":"DEVICEID",
    //   "user_ticket": "USER_TICKET"，
    //   "expires_in":7200
    // }

    debug('%s %s get user: %j', req.method, req.url, user);

    // let passport do verify and call verify hook
    app.passport.doVerify(req, user, done);
  }))
  ;
};
