'use strict';

const hashing = require('../utils/hashing');

module.exports = {
  checkStatus: async (req, res, next) => {
    const signedToken = req.query.signature || '';
    const requestId = req.params.requestId || '';

    const calculatedSignature = hashing.generateSignedTokenFromId(requestId);

    if (!hashing.hmacCompare(calculatedSignature, signedToken)) {
      return res.status(404).json({
        status: 'not-found'
      });
    }

    return next();
  }
};
