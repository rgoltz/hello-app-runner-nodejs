// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.ITEMS_NAME;

export default {
  get: (params) => docClient.send(new GetCommand({ TableName, ...params })),
  put: (params) => docClient.send(new PutCommand({ TableName, ...params })),
  query: (params) => docClient.send(new ScanCommand({ TableName, ...params })),
  update: (params) => docClient.send(new UpdateCommand({ TableName, ...params })),
  delete: (params) => docClient.send(new DeleteCommand({ TableName, ...params })),
};
