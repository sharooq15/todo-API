const {
  v4: uuidv4
} = require('uuid');
var AWS = require("aws-sdk");

let awsConfig = {
  "region": "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId": "AKIAIMCSLPRW5UUOY7WA",
  "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

export let save = function () {

  var input = {
    "id": uuidv4(),
    "username": "user1",
    "password": "task1"
  };
  var params = {
    TableName: "user",
    Item: input
  };
  docClient.put(params, function (err, data) {

    if (err) {
      console.log("users::save::error - " + JSON.stringify(err, null, 2));
    } else {
      console.log("users::save::success", input);
    }
  });
}

save();