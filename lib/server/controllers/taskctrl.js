import {
  checkIfSessionExist
} from './sessionctrl';
const { v4: uuidv4 } = require('uuid');
const AWS = require("aws-sdk");

AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();

const currentDate = new Date().toString();

export const createTask = async (req, res) => {
  const {
    sessionId,
    username,
    taskName,
    expiry,
  } = req.body;
  if(await checkIfSessionExist(sessionId,username)){
    const input = {
      "id": uuidv4(),
      "uName": username,
      "name": taskName,
      "dtC": currentDate,
      "dtU": currentDate,
      "exp": new Date(expiry).toString(),
      "cStatus": false,
      "isD": false
    };
    const params = {
      TableName: "task",
      Item: input
    };
    docClient.put(params, function (err, data) {

      if (err) {
        console.log("users::create-task::error - " + JSON.stringify(err, null, 2));
      } else {
        console.log("users::create-task::success", input);
        res.send(input);
      }
    });
  }

}

export const updateTask = async (req, res) => {
  const {
    sessionId,
    username,
    taskId,
    completionStatus,
  } = req.body;
  if (await checkIfSessionExist(sessionId, username)) {
    let params = {
      TableName: "task",
      Key: {
        "id": taskId,
      },
      UpdateExpression: "set dtU = :dateUpdated, cStatus = :completionStatus",
      ExpressionAttributeValues: {
        ":dateUpdated": currentDate,
        ":completionStatus": completionStatus,
      },
      ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

      if (err) {
        console.log("users::update-task::error - " + JSON.stringify(err, null, 2));
      } else {
        console.log("users::update-task::success " + JSON.stringify(data));
        res.send(data);
      }
    });
  }
}

export const deleteTask = async (req,res) => {
  const {
    sessionId,
    username,
    taskId
  } = req.body;
  if (await checkIfSessionExist(sessionId, username)) {
    let params = {
      TableName: "task",
      Key: {
        "id": taskId,
      },
      UpdateExpression: "set dtU = :dateUpdated, isD = :isDeleted",
      ExpressionAttributeValues: {
        ":dateUpdated": currentDate,
        ":isDeleted": true
      },
      ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

      if (err) {
        console.log("users::delete-task::error - " + JSON.stringify(err, null, 2));
      } else {
        console.log("users::delete-task::success " + JSON.stringify(data));
        res.send("Deleted successfully");
      }
    });
  }
}

export const restoreTask = async (req,res) => {
  const {
    sessionId,
    username,
    taskId
  } = req.body;
  if (await checkIfSessionExist(sessionId, username)) {
    let params = {
      TableName: "task",
      Key: {
        "id": taskId,
      },
      UpdateExpression: "set dtU = :dateUpdated, isD = :isDeleted",
      ExpressionAttributeValues: {
        ":dateUpdated": currentDate,
        ":isDeleted": false
      },
      ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

      if (err) {
        console.log("users::restore-task::error - " + JSON.stringify(err, null, 2));
      } else {
        console.log("users::restore-task::success " + JSON.stringify(data));
        res.send("Restored Successfully");
      }
    });
  }
}

export const viewTask = async (req,res,next) => {
  const expired = [];
  const completed = [];
  const pending = [];
  const deleted = [];
  const {
    sessionId,
    username
  } = req.body;
  if (await checkIfSessionExist(sessionId, username)) {
    const params = {
      TableName: "task",
      FilterExpression: "#uName = :username",
      ExpressionAttributeNames: {
        "#uName": "uName",
      },
      ExpressionAttributeValues: {
        ":username": username
      }
    };

    docClient.scan(params, function (err, data) {
      if (err) {
        console.log("users::view-task::error - " + JSON.stringify(err, null, 2));
        next(err);
      } else {
          console.log("users::view-task::success - " + JSON.stringify(data, null, 2));
          data.Items.forEach((datum) => {
            const isExpired = datum.exp > currentDate;
            console.log('datum',datum.exp, 'curr', currentDate, isExpired);
            const isCompleted = datum.cStatus;
            const isDeleted = datum.isD;
            if(isExpired && !isDeleted && !isCompleted){
              expired.push(datum);
            }
            if(!isExpired && isCompleted && !isDeleted){
              completed.push(datum);
            }
            if (!isExpired && !isCompleted && !isDeleted){
              pending.push(datum);
            }
            if (isDeleted){
              deleted.push(datum);
            }
          })
          const result = {
            pending,
            expired,
            completed,
            deleted,
          }
          res.send(result)
      }
    })
  }
}
