require('datejs');  // This extends the date object.
var moment = require('moment');
var AWS = require('aws-sdk');
var AlexaSkill = require('./AlexaSkill');

var APP_ID = 'amzn1.echo-sdk-ams.app.13dd790c-0fda-494c-ba6a-cf2805dc33e0';

AWS.config.loadFromPath('./config.json');
var docClient = new AWS.DynamoDB.DocumentClient();

function getMenu(day, callback) {
    var reqDate = moment(Date.parse(day));

    var longDate = reqDate.format('dddd, MMMM Do');
    var lookupDate = reqDate.format('YYYY-MM-DD');
    console.log(longDate);
    console.log(lookupDate);
    docClient.get({
        TableName: 'MenuData',
        Key: {
            dateTs: lookupDate
        }
    }, function (err, data) {
        console.log(err, data);
        if (err) {
            console.log(err, err.stack);
            callback(err);
        }
        else if (data.Item === undefined) {
            callback(null, {
                date: longDate,
                speech: 'There is no menu for ' + longDate
            });
        }
        else {
            var menuData = JSON.parse(data.Item.menu);
            callback(null, {
                date: longDate,
                speech: 'The menu for ' + longDate + ' has ' + menuData.lunch
            });
        }
    });
}

// console.log(getMenu('today'));
// console.log(getMenu('tomorrow'));
// console.log(getMenu('friday'));
// console.log(getMenu('next wednesday'));
// console.log(getMenu('saturday'));
// console.log(getMenu('yesterday'));

var MenuSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

MenuSkill.prototype = Object.create(AlexaSkill.prototype);
MenuSkill.prototype.constructor = MenuSkill;

MenuSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log('MenuSkill onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId);

    var speechText = 'Welcome to the menu helper.  You can ask, what is the menu for today.';
    response.ask(speechText, speechText);
};

MenuSkill.prototype.intentHandlers = {
    GetDateIntent: function (intent, session, response) {
        var daySlot = intent.slots.day.value;
        getMenu(daySlot, function (err, menu) {
            var cardTitle = 'Menu for ' + menu.date;
            var speechOutput = {
                speech: menu.speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, menu.speech);
        });
    },

    'AMAZON.HelpIntent': function (intent, session, response) {
        var speechText = 'You may ask, what is the menu for today.';
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput);
    },

    'AMAZON.StopIntent': function (intent, session, response) {
        response.tell('Goodbye.');
    },

    'AMAZON.CancelIntent': function (intent, session, response) {
        response.tell('Goodbye.');
    }
};

exports.handler = function (event, context) {
    var menuSkill = new MenuSkill();
    menuSkill.execute(event, context);
};
