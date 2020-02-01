'use strict';

const ide = require('../src/ide/ide-requests');

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
module.exports = async (event, context) => {
  const pubsubMessage = Buffer.from(event.data, 'base64').toString();

  /**
   * @typedef {{id: string, lang: string, source: string, stdin: string}} Job
   * @type {{job: Job, stdout: string, stderr: string, compile_stderr: string, time_log: string, isTLE: boolean}}
   */
  const data = JSON.parse(pubsubMessage);
  const job = data.job;

  const payload = {
    id: job.id,
    stdout: data.stdout,
    stderr: data.stderr,
    compile_stderr: data.compile_stderr,
    time_log: data.time_log,
    isTLE: data.isTLE
  };

  return ide.updateIDERequest(payload);
};
