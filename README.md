# todo
This application monitors and keeps track of all the task to be done,pending,expired and deleted

### Version
0.0.0

### Tech

 * A Node.js, Express.js and ReactJS based application
 * Written in ES6, it uses babel to transform ES6 to ES5

### Prerequisites

 * NodeJS 4.4.x and above
 * NPM 2.3.x and above

The application requires some initial configuration.

### Development

For Starting the app
```sh
$ npm install
$ npm start
```
Use PostMan for sending request and getting the response

### FOR TESTING

URL

```sh
http://localhost:your-port-number/api/
Check index.js file in routes for further urls
```
PARAMETERS
  * signup(username,password)
  * signin(username,password)
  * signout(username)
  * createTask(sessionId,username,taskName,expiry)
  * updateTask(sessionId,username,taskId,completionStatus)
  * deleteTask(sessionId,username,taskId)
  * restoreTask(sessionId,username,taskId)
  * viewTask(sessionId,username)

For each and every changes or mutations made, you can run the viewTask query to view the changes happened by the mutation

### TABLES CREATED
  * user
  * task
  * session

### TECHNOLOGIES USED
  * Node.js
  * Express.js
  * AWS Dynamodb

### UPDATE AWS CONFIG
const awsConfig = {
  "region": "",
  "endpoint": "",
  "accessKeyId": "",
  "secretAccessKey": ""
};
