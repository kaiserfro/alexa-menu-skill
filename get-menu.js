var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var docClient = new AWS.DynamoDB.DocumentClient();

docClient.get({
    TableName: 'MenuData',
    Key: {
        dateTs: '2016-03-02'
    }
}, function (err, data) {
    if (err)
        console.log(err, err.stack);
    else {
        console.log(data);
    }
});
