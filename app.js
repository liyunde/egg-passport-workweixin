'use strict';

const debug = require('debug')('egg-passport-workweixin');
const assert = require('assert');
const Strategy = require('passport-workweixin').Strategy;

module.exports = app => {

  const config = app.config.passportWorkweixin;

  config.passReqToCallback = true;

  assert(config.key, '[egg-passport-workweixin] config.passportWorkweixin.key required');
  assert(config.secret, '[egg-passport-workweixin] config.passportWorkweixin.secret required');

  config.clientID = config.key;
  config.clientSecret = config.secret;

  config.requireState = false;

  config.cache = app.redis;

  /**
   * 获取用户的回调
   */
  app.passport.use('workweixin', new Strategy(config, (req, accessToken, ticket, params, profile, done) => {
    // format user
    const user = {
      provider: 'workweixin',
      id: profile.id,
      name: profile.username,
      displayName: profile.displayName,
      photo: profile.photo,
      // accessToken,
      // ticket,
      profile
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
