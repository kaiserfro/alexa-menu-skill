require('datejs');  // This extends the date object.
var moment = require('./moment');
var AlexaSkill = require('./AlexaSkill');

var APP_ID = undefined;

var menu = {
    "2016-02-01": "mini cheeseburger, kickin ranch goldfish",
    "2016-02-02": "round pepperoni pizza",
    "2016-02-03": "popcorn chicken and mashed potatoes with biscuit, chocolate chip chortles",
    "2016-02-04": "mini corndogs with potato wedges and rips",
    "2016-02-05": "general tso chicken over brown rice, fortune cookie",
    "2016-02-09": "pepperoni and cheese stuffed sticks, state capital cookie",
    "2016-02-10": "bacon cheeseburger, chocolate chip cookie",
    "2016-02-11": "teriyaki chicken over brown rice, fortune cookie",
    "2016-02-12": "heart chicken nuggets with potato wedges, sweet heart icee",
    "2016-02-16": "round pepperoni pizza, president cookie",
    "2016-02-17": "double dogs with baked chips",
    "2016-02-18": "chicken strips with potato wedges, scooby crackers",
    "2016-02-19": "pasta with meatballs, frozen fruit cup",
    "2016-02-22": "big bean and cheese burrito with baked chips",
    "2016-02-23": "pepperoni and cheese stuffed sticks",
    "2016-02-24": "cheese enchilada, all sport vanilla cookie",
    "2016-02-25": "chicken patty sandwich on a whole grain bun, chocolate brownie",
    "2016-02-26": "beef bar b. cue sandwich, sour fruit juice icee",
}

function getMenu(day) {
    var reqDate = moment(Date.parse(day));
    var response = '';

    var longDate = reqDate.format('dddd, MMMM Do');
    var lookupDate = reqDate.format('YYYY-MM-DD');
    if (lookupDate in menu) {
        var menuItem = menu[lookupDate];
        return {
            date: longDate,
            speech: 'The menu for ' + longDate + ' has ' + menuItem
        };
    }
    else {
        return {
            date: longDate,
            speech: 'There is no menu for ' + longDate
        };
    }
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
MenuSkill.prototype = MenuSkill;

MenuSkill.prototype.evenHandlers.onLaunch = function (launchRequest, session, response) {
    console.log('MenuSkill onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId);

    handleGetDateIntent(session, response);
};

MenuSkill.prototype.intentHandlers = {
    GetDateIntent: function (intent, session, response) {
        var daySlot = intent.slots.day;
        var response = getMenu(daySlot);
        var cardTitle = 'Menu for ' + response.date;
        var speechOutput = {
            speech: response.speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tellWithCard(speechOutput, cardTitle, response.speech);
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
