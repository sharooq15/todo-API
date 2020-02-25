var AWS = require("aws-sdk");
let awsConfig = {
  "region": "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId": "AKIAIMCSLPRW5UUOY7WA",
  "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let modify = function () {


  var params = {
    TableName: "task",
    Key: {
      "id": "example-1@gmail.com"
    },
    UpdateExpression: "set dtU = :dateUpdated, isD = :isDeleted",
    ExpressionAttributeValues: {
      ":dateUpdated": new Date().toString(),
      ":isDeleted": true
    },
    ReturnValues: "UPDATED_NEW"

  };
  docClient.update(params, function (err, data) {

    if (err) {
      console.log("users::update::error - " + JSON.stringify(err, null, 2));
    } else {
      console.log("users::update::success " + JSON.stringify(data));
    }
  });
}

modify();
