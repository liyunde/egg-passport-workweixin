# egg-passport-workweixin

work weixin passport plugin for egg

## Install

```bash
$ npm i egg-passport-workweixin --save
```

## Usage

```js
// config/plugin.js
exports.passportWorkWeiXin = {
  enable: true,
  package: 'egg-passport-workweixin',
};
```

## Configuration

```js
// config/config.default.js
exports.passportWorkWeiXin = {
  key: 'your oauth key',
  secret: 'your oauth secret',
  agentId: 0,
  callbackURL: '/passport/workweixin/callback'
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/liyunde/egg-passport-workweixin/issues).

## License

[Apache 2.0](LICENSE)
