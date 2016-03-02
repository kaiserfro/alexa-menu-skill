var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var moment = require('moment');

var docClient = new AWS.DynamoDB.DocumentClient();

var menu = {
    "2016-03-01": "round pepperoni pizza",
    "2016-03-02": "popcorn chicken and mashed potatoes with biscuit, chocolate chip chortles",
    "2016-03-03": "chicken patty sandwich on a whole grain bun with rips",
    "2016-03-04": "mini pancakes with string cheese and raspberry bites",
    "2016-03-07": "beef bar bee cue rib sandwich, sour lemon raisels",
    "2016-03-08": "pepperoni and cheese stuffed sticks",
    "2016-03-09": "bacon cheeseburger, chocolate chip cookie",
    "2016-03-10": "teriyaki chicken over brown rice, fortune cookie",
    "2016-03-11": "toasted cheesy sandwich, frozen fruit cup",
    "2016-03-14": "chicken strips with potato wedges, kickin' cheddar gold fish",
    "2016-03-15": "round pepperoni pizza",
    "2016-03-16": "double dogs with baked chips",
    "2016-03-17": "shamrock nuggets with potato wedges and luck O. the icee",
    "2016-03-18": "cheese enchiladas, scooby crackers",
    "2016-03-21": "big bean and cheese burrito with baked chips",
    "2016-03-22": "pepperoni and cheese stuffed sticks",
    "2016-03-23": "pasta with meatballs, all sport vanilla cookies",
    "2016-03-24": "mini corndogs with potato wedges and chocolate brownie",
    "2016-03-25": "cheesy mac and cheese, frozen fruit cup",
};

Object.keys(menu).forEach(function (e) {
    console.log(e)
    console.log(menu[e]);
    var item = {
        dateTs: e,
        menu: JSON.stringify({lunch: menu[e]})
    };
    console.log(item);
    docClient.put({
        TableName: 'MenuData',
        Item: item
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        console.log(data);
    });
});
