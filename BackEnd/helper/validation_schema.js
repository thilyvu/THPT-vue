const Joi = require("joi");

const userRegisterSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  gender: Joi.string(),
  name: Joi.required(),
  province: Joi.string(),
  username: Joi.string().trim(),
  phone: Joi.string(),
  school: Joi.string(),
  DOB: Joi.date(),
  avatar: Joi.string(),
  authId: Joi.string(),
  loginType: Joi.string()
});
const userFacebookRegisterSchema = Joi.object().keys({
  email: Joi.string().trim().email(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  gender: Joi.string(),
  name: Joi.required(),
  province: Joi.string(),
  username: Joi.string().trim(),
  phone: Joi.string(),
  school: Joi.string(),
  DOB: Joi.date(),
  avatar: Joi.string(),
  authId: Joi.string(),
  loginType: Joi.string()
});

const userUpdateSchema = Joi.object().keys({
  gender: Joi.string(),
  DOB: Joi.date(),
  province: Joi.string(),
  school: Joi.string(),
  phone: Joi.string(),
  avatar: Joi.string(),
  name: Joi.string(),
  role: Joi.string(),
});
const verifyCodeSchema = Joi.object().keys({
  email: Joi.string().required(),
  code: Joi.string().required(),
});
const userTokenSchema = Joi.object().keys({
  refreshToken: Joi.string(),
});
const userUpdatePasswordValidation = Joi.object().keys({
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});
const userResetPasswordValidation = Joi.object().keys({
  oldPassword: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
  newPassword: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});
module.exports = {
  userRegisterSchema,
  userUpdateSchema,
  userUpdatePasswordValidation,
  userResetPasswordValidation,
  userTokenSchema,
  verifyCodeSchema,
  userFacebookRegisterSchema
};
