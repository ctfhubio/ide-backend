'use strict';

const crypto = require('crypto');

module.exports = {
  /**
   * @param {string} id
   * @return {string}
   */
  generateSignedTokenFromId: id => {
    return crypto
      .createHmac('sha256', process.env.APP_SIGNING_SECRET || 'secret')
      .update(JSON.stringify(id))
      .digest('hex');
  },

  hmacCompare: (hashString1, hashString2) => {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(hashString1),
        Buffer.from(hashString2)
      );
    } catch (e) {
      return false;
    }
  }
};
