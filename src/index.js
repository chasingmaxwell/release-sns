const aws = require('aws-sdk');

module.exports = (pluginConfig, config, callback) => {
  const sns = new aws.SNS({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: pluginConfig.region || 'us-east-1',
  });

  sns.publish({
    Message: JSON.stringify({ version: config.pkg.version }),
    TargetArn: pluginConfig.targetArn,
  }, callback);
};
