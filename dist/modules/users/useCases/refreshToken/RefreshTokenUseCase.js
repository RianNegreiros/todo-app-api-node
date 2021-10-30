"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefreshTokenUseCase = void 0;

var _jsonwebtoken = require("jsonwebtoken");

var _tsyringe = require("tsyringe");

var _IUserTokensRepository = require("../../repositories/IUserTokensRepository");

var _IDateProvider = require("../../../../shared/container/providers/DateProvider/IDateProvider");

var _auth = _interopRequireDefault(require("../../../../config/auth"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let RefreshTokenUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UserTokensRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('DateProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IUserTokensRepository.IUserTokensRepository === "undefined" ? Object : _IUserTokensRepository.IUserTokensRepository, typeof _IDateProvider.IDateProvider === "undefined" ? Object : _IDateProvider.IDateProvider]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class RefreshTokenUseCase {
  constructor(userTokensRepository, dateProivder) {
    this.userTokensRepository = userTokensRepository;
    this.dateProivder = dateProivder;
  }

  async execute(token) {
    const {
      email,
      sub
    } = (0, _jsonwebtoken.verify)(token, _auth.default.refresh_token);
    const user_id = sub;
    const userTokens = await this.userTokensRepository.findByUserIdAndRefreshTokens(user_id, token);

    if (!userTokens) {
      throw new Error('Refresh Token Error');
    }

    await this.userTokensRepository.deleteById(userTokens.id);
    const expires_date = this.dateProivder.addDays(_auth.default.refresh_token_expires_date);
    const refresh_token = (0, _jsonwebtoken.sign)({
      email
    }, _auth.default.refresh_token, {
      subject: user_id,
      expiresIn: _auth.default.expires_in_refresh_token
    });
    await this.userTokensRepository.create({
      expires_date,
      refresh_token,
      user_id
    });
    const newToken = (0, _jsonwebtoken.sign)({}, _auth.default.jwt_token, {
      subject: user_id,
      expiresIn: _auth.default.expires_in_token
    });
    return {
      refresh_token,
      token: newToken
    };
  }

}) || _class) || _class) || _class) || _class) || _class);
exports.RefreshTokenUseCase = RefreshTokenUseCase;