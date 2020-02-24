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
   * @type {{job: Job, stdout: string, stderr: string, compile_stdout: string, compile_stderr: string, exec_time: string, isTLE: boolean, isRuntimeErr: boolean, is_worker_error: boolean}}
   */
  const data = JSON.parse(pubsubMessage);
  const job = data.job;

  const payload = {
    id: job.id,
    stdout: data.stdout,
    stderr: data.stderr,
    compile_stdout: data.compile_stdout,
    compile_stderr: data.compile_stderr,
    exec_time: data.exec_time,
    isTLE: data.isTLE,
    isRuntimeErr: data.isRuntimeErr,
    isWorkerError: data.is_worker_error
  };

  return ide.updateIDERequest(payload);
};
