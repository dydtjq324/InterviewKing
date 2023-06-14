const { User }  = require('../models/index');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = process.env.SECRET_KEY;

const userTokenValidate = async (req, res, next) => {
  // console.log('미들웨어 실행!');

  // 쿠키값 사용 주석 처리
  // const token = req.cookies.token;

  // json body (localStorage 값 사용)
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({
      resultCode: "401",
      message: "토큰이 없습니다."
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    // 토큰이 유효한 경우
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      // 토큰이 유효하지 않은 경우
      return res.status(401).json({
        resultCode: "401",
        message: "유효하지 않은 토큰입니다."
      });
    } else if (err.name === 'TokenExpiredError') {
      // 토큰이 만료된 경우
      return res.status(401).json({
        resultCode: "401",
        message: "만료된 토큰입니다."
      });
    } else {
      // 기타 토큰 검증 실패
      return res.status(500).json({
        resultCode: "500",
        message: "서버 오류"
      });
    }
  }
};

module.exports = userTokenValidate;