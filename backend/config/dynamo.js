const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: "us-east-1", // or your actual region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
module.exports = dynamoDB;
