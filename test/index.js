const test = require('ava').test;
const sinon = require('sinon');
const aws = require('aws-sdk');
const plugin = require('../src/index');

process.env.AWS_ACCESS_KEY = '123';
process.env.AWS_SECRET_KEY = 'abc';

const publishStub = sinon.stub().callsFake((params, callback) => {
  callback(null, { it: 'worked' });
});
const snsStub = sinon.stub(aws, 'SNS').returns({ publish: publishStub });

test.after.always(() => snsStub.restore());

test.serial.cb('The plugin sends an SNS message.', (t) => {
  t.plan(2);
  const targetArn = 'version:bump:yay';
  const expectedSNSParams = {
    accessKeyId: '123',
    secretAccessKey: 'abc',
    region: 'us-east-1',
  };
  const expectedPublishParams = {
    Message: '{"version":"v1.0.0"}',
    TargetArn: targetArn,
  };
  plugin({ targetArn }, { pkg: { version: 'v1.0.0' } }, (err, res) => {
    t.is(err, null, 'Unexpected error.');
    t.deepEqual(res, { it: 'worked' }, 'Unexpected response.');
    sinon.assert.calledWith(snsStub, expectedSNSParams);
    sinon.assert.calledWith(publishStub, expectedPublishParams);

    expectedSNSParams.region = 'us-west-1';
    plugin({ targetArn, region: 'us-west-1' }, { pkg: { version: 'v1.0.0' } }, () => {
      sinon.assert.calledWith(snsStub, expectedSNSParams);
      t.end();
    });
  });
});

test.serial.cb('The plugin handles errors.', (t) => {
  t.plan(1);
  const publishError = new Error('publish failed');
  publishStub.callsFake((params, callback) => {
    callback(publishError);
  });
  plugin({}, { pkg: {} }, (err) => {
    t.deepEqual(err, publishError, 'Unexpected error.');
    t.end();
  });
});
