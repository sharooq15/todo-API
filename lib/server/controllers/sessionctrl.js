const AWS = require("aws-sdk");

AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient();

export const checkIfSessionExist = async (
  sessionId,
  username
  ) => {
var params = {
  TableName: "session",
  Key: {
    "uName": username
  }
};
return new Promise((resolve, reject) => {
  docClient.get(params, function (err, data) {
    if (err) {
      console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
    } else {
      if (data.Item.sId === sessionId) {
        resolve(true);
      }
      resolve(false);
      console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
    }
  })
})
}
