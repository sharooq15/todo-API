const {
  v4: uuidv4
} = require('uuid');
const AWS = require("aws-sdk");

AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient();

export const signup = (req, res) => {
  const {
    username,
    password,
  } = req.body;
  const input = {
    "uName": username,
    "pwd": password,
  };
  const params = {
    TableName: "user",
    Item: input
  };
  const sessionInput = {
    "uName": username,
    "sId": uuidv4(),
  }
  const sessionParam = {
    TableName: "session",
    Item: sessionInput
  }
  docClient.put(params, function (err, data) {
    if (err) {
      console.log("users::signup::error - " + JSON.stringify(err, null, 2));
    } else {
      console.log("users::signup::success", input);
    }
  });

  docClient.put(sessionParam, function (err, data) {

    if (err) {
      console.log("users::save::error - " + JSON.stringify(err, null, 2));
    } else {
      console.log("users::save::success", input);
      res.send(sessionInput);
    }
  });
}

export const signin = (req, res) => {
  const {
    username,
    password
  } = req.body;

  const params = {
    TableName: "user",
    Key: {
    "uName": username
    }
  };
  const sessionInput = {
    "uName": username,
    "sId": uuidv4(),
  }
  const sessionParam = {
    TableName: "session",
    Item: sessionInput
  }
  docClient.get(params, function (err, data) {
    console.log(data);
    if (err) {
      console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
    } else {
      if(data.Item.pwd === password){
          docClient.put(sessionParam, function (err, data) {
            if (err) {
              console.log("users::save::error - " + JSON.stringify(err, null, 2));
            } else {
              console.log("users::save::success", sessionParam);
            }
          });
        console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
        res.send(sessionParam.Item);
      }
      else {
        console.log("users::fetchOneByKey::failure - " + JSON.stringify(data, null, 2));
        res.send('failure');
      }
    }
  });
}

export const signout = (req, res) => {
  const {
    username
  } = req.body;
  const params = {
    TableName: "session",
      Key: {
      "uName": username,
      }
  };
  docClient.delete(params, function (err, data) {

  if (err) {
    console.log("users::signout::error - " + JSON.stringify(err, null, 2));
  } else {
    console.log("users::signout::success");
    res.send("Successfully Logged out");
  }
});
}
