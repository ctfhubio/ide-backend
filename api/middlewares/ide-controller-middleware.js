'use strict';

const hashing = require('../utils/hashing');

const { OAuth2Client } = require('google-auth-library');
const authClient = new OAuth2Client();

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
  },

  authPubsub: async (req, res, next) => {
    try {
      const { PUBSUB_VERIFICATION_TOKEN } = process.env;
      if (req.query.token !== PUBSUB_VERIFICATION_TOKEN) {
        res.status(401).send();
        return;
      }

      const bearer = req.header('Authorization');
      const [, token] = bearer.match(/Bearer (.*)/);

      const ticket = await authClient.verifyIdToken({
        idToken: token,
        audience: process.env.APP_URL || 'https://ide.ctfhub.io'
      });
      // eslint-disable-next-line no-unused-vars
      const claim = ticket.getPayload();

      return next();
    } catch (err) {
      return res.status(401).send();
    }
  }
};
