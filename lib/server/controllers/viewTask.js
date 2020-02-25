var AWS = require("aws-sdk");
let awsConfig = {
  "region": "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId": "AKIAIMCSLPRW5UUOY7WA",
  "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function () {
  var params = {
    TableName: "task",
    FilterExpression: "#uId = :userId",
    ExpressionAttributeNames: {
        "#uId": "uId",
      },
      ExpressionAttributeValues: {
        ":userId": "user1"
      }
  };
  docClient.scan(params, function (err, data) {

    if (err) {
      console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
    } else {
      console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
    }
  })
}


fetchOneByKey();
