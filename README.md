[![Build Status](https://travis-ci.org/chasingmaxwell/release-sns.svg?branch=master)](https://travis-ci.org/chasingmaxwell/release-sns.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/chasingmaxwell/release-sns/badge.svg?branch=master)](https://coveralls.io/github/chasingmaxwell/release-sns?branch=master)

# release-sns

release-sns is a [semantic-release](https://github.com/semantic-release/semantic-release) plugin which allows you to send an AWS SNS message to a configured topic when a new version of your package is released.

## Installation

1. Require this package.

   `yarn add --dev release-sns`

   or

   `npm i --save-dev release-sns`

2. Configure your package.json.

   Ensure your package.json file has the following configuration for the "release" property.

   ```json
   {
     "release": {
       "generateNotes": [
         {
           "path": "@semantic-release/release-notes-generator"
         },
         {
           "path": "release-sns",
           "targetArn": "[The ARN associated with your topic or endpoint]",
           "region": "[The region in which your ARN exists]"
         }
       ]
     }
   }
   ```

   Including semantic-release's default [release-notes-generator plugin](https://github.com/semantic-release/release-notes-generator) will preserve the release note generation which occurs by default. The `targetArn` property is required. If `region` is not provided, release-sns will default to "us-east-1".
