
const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');
var Cashbot = require('cashbot');
var cashbot = Cashbot.init('nNZVWQQYDN93yn0wzBAF42iF8b55R5w72AXQ2XJN');
var moment = require('moment-timezone');
var NodeGeocoder = require('node-geocoder');
app = express();
const async = require('async');

//setting Port
app.set("port", process.env.PORT || 7000);

//serve static files in the public directory
app.use(express.static("public"));

// Process application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// Process application/json
app.use(bodyParser.json());

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyDP-9nmT5mGoVF4YPMRZB_k9Y_53QJB3rg', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);


///
const api = require('mobile-locator');

const locate = api('google', { key: 'AIzaSyDP-9nmT5mGoVF4YPMRZB_k9Y_53QJB3rg' });
app.get("/bot", function (request, response) {

    // geocoder.geocode('1741 Khoza Steet phomolong section tembisa', function(err, res) {
    //     console.log("===Geocode====");
    //     console.log(res);
    //   });

    // geocoder.reverse({lat:-25.5403, lon:28.0969}, function(err, res) {
    //     console.log("==Geo Reverse===");
    //     console.log(res);
    // });

    // locate({ mcc: 460, mnc: 0, lac: 4219, cid: 20925 })
    //  .then(location => console.log(JSON.stringify(location, null, 2)));

    var unirest = require("unirest");

    var req = unirest("GET", "https://mobilenumbertracker-mobile-number-tracker-v1.p.rapidapi.com/v1/person/mobile/9810012345/");

    req.query({
        "auth_token": ""
    });

    req.headers({
        "x-rapidapi-host": "mobilenumbertracker-mobile-number-tracker-v1.p.rapidapi.com",
        "x-rapidapi-key": "83c648af7fmshb25efba15a528a0p1c44abjsn067444d7f536"
    });


    req.end(function (res) {
        if (res.error) { console.log(res.error) }

        //console.log(res.body);
    });

})

app.post("/", function (request, response) {

    const agent = new WebhookClient({ request: request, response: response });
    //console.log(request.body.originalDetectIntentRequest.payload.data);
    console.log("I am here");

    // console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    let content = {
        email: request.body.originalDetectIntentRequest.payload.text

    }



    function welcome(agent) {
        console.log("TESTING=====");
        // console.log(request.body.originalDetectIntentRequest.payload.from.first_name);
        console.log(request.body.originalDetectIntentRequest.payload.text);
        agent.add(`Welcome to my agent! ` + request.body.originalDetectIntentRequest.payload.from.first_name);



        return passReset(request.body.originalDetectIntentRequest.payload.text).then(data => {

            console.log(data.msg);
            agent.add(data.msg);
        })


    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function emailSend(agent) {
        console.log("=====Initiating Email Request=====");

        return passReset(request.body.originalDetectIntentRequest.payload.text).then(data => {

            console.log(data.msg);
            agent.add(data.msg);
        })


    }

    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function yourFunctionHandler(agent) {
    //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    //   agent.add(new Card({
    //       title: `Title: this is a card title`,
    //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //       buttonText: 'This is a button',
    //       buttonUrl: 'https://assistant.google.com/'
    //     })
    //   );
    //   agent.add(new Suggestion(`Quick Reply`));
    //   agent.add(new Suggestion(`Suggestion`));
    //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    // }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('email_send', emailSend);
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});

function passReset(email) {
    return new Promise((resolve, reject) => {

        let content = {
            email: email
        }

        axios.post('http://transnodeichef.herokuapp.com/techDev/api/passwordReset/', content)
            .then(serverResponse => {
                //callback(null, serverResponse);
                console.log("Body from the API request");
                console.log(serverResponse.data.result.body.message)
                resolve({ msg: serverResponse.data.result.body.message });
            })
            .catch(error => {

                console.log("Test API Error");
                resolve({ msg: " Error Receiving API returned message" });


            })

    })

}


app.post("/chatbot", function (request, response) {


    const agent = new WebhookClient({ request: request, response: response });
    //console.log(request.body.originalDetectIntentRequest.payload.data);
    console.log("I am here");

    // console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    let content = {
        email: request.body.originalDetectIntentRequest.payload.text

    }



    function welcome(agent) {
        console.log("TESTING=====");
        // console.log(request.body.originalDetectIntentRequest.payload.from.first_name);
        console.log(request.body.originalDetectIntentRequest.payload.text);
        agent.add(`Welcome to my agent! ` + request.body.originalDetectIntentRequest.payload.from.first_name);



        return passReset(request.body.originalDetectIntentRequest.payload.text).then(data => {

            console.log(data.msg);
            agent.add(data.msg);
        })


    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }


    function cashbotSend(agent) {
        return cashbotRequest().then(data => {

            console.log("==Cashbot Response===");

            //let result = data[0];
            agent.add(`My CashBot message`);

            for (let i = 0; i < data.length; i++) {

                agent.add(new Card({
                    title: data[i].title,
                    imageUrl: data[i].image_url,
                    text: data[i].subtitle,
                    buttonText: data[i].buttons[0].title,
                    buttonUrl: data[i].buttons[0].url
                })
                );


            }
            // agent.add(new Card({
            //     title: result.title,
            //     imageUrl: result.image_url ,
            //     text: result.subtitle,
            //     buttonText: result.buttons[0].title,
            //     buttonUrl: result.buttons[0].url
            // })
            // );

        })
    }

    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function yourFunctionHandler(agent) {
    //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    //   agent.add(new Card({
    //       title: `Title: this is a card title`,
    //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //       buttonText: 'This is a button',
    //       buttonUrl: 'https://assistant.google.com/'
    //     })
    //   );
    //   agent.add(new Suggestion(`Quick Reply`));
    //   agent.add(new Suggestion(`Suggestion`));
    //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    // }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('to_send', cashbotSend);
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);



});

function cashbotRequest() {

    return new Promise((resolve, reject) => {

        console.log("botApi");
        // console.log(moment.tz.names());

        let USER = {
            ID: "908745",
            //ID: request.body.originalDetectIntentRequest.payload.data.message.chat.id,
            TIMEZONE: -4,
            GENDER: "male",
            LOCALE: "en_US",
            FIRST_NAME: "Jemal",
            //FIRST_NAME:request.body.originalDetectIntentRequest.payload.data.message.chat.first_name,
            LAST_NAME: "Sandro",
            //LAST_NAME:request.body.originalDetectIntentRequest.payload.data.message.chat.last_name,
            PROFILE_PIC: "https:photo/saved"
        }

        cashbot.postGetQuery(USER.ID, { timezone: USER.TIMEZONE, gender: USER.GENDER, locale: USER.LOCALE, first_name: USER.FIRST_NAME, last_name: USER.LAST_NAME, profile_pic: USER.PROFILE_PIC })
            .then(function (res) {

                resolve(res.messages[0].attachment.payload.elements);

                //   agent.add(new Card({
                //        title: 'Daily ',
                //       imageUrl: 'https://cdn.cashbot.ai/bot2bot/27-1.jpg',
                //       text: `One Game `,
                //       buttonText: '� Press Now �',
                //       buttonUrl: 'https://bots.cashbot.ai/load?refUserId=65494546&aid=1386&url=http%3A%2F%2Faffiliates.audiobooks.com%2Ftracking%2Fscripts%2Fclick.php%3Fa_aid%3D5bc766f64fc04%26a_bid%3D229e13d4&timestamp=1554066822409&b2bid=36&placement=0&type=1&hmac=4603588a3f3747cb7b562aa46b1517ad0deb291abd6a2d67a68f3e71cb1ee13d'

                //     })
                //   );

            })
            .catch(function (err) {
                console.log("==Err Handle==");
                resolve({ messageRes: err });
            })
    })

}




// Spin up the server
app.listen(app.get("port"), function () {
    console.log("I am here at", app.get("port"));
});


