
const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');
var Cashbot = require('cashbot');
var cashbot = Cashbot.init('nNZVWQQYDN93yn0wzBAF42iF8b55R5w72AXQ2XJN');
var moment = require('moment-timezone');
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

        

        return passReset(request.body.originalDetectIntentRequest.payload.text).then(data=>{

            console.log(data.msg);
            agent.add(data.msg);
        })
      

    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
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
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});

function passReset(email)
{
    return new Promise((resolve, reject)=>{

        let content = {
            email: email
        }

        axios.post('http://transnodeichef.herokuapp.com/techDev/api/passwordReset/', content)
        .then(serverResponse => {
            //callback(null, serverResponse);
            console.log("Body from the API request");
            console.log(serverResponse.data.result.body.message)
            resolve({msg:serverResponse.data.result.body.message});
        })
        .catch(error => {
            
            console.log("Test API Error");
            resolve({msg:" Error Receiving API returned message"});


        })

    })

}


app.get("/bot", function (request, response){
	
    console.log("botApi");
   // console.log(moment.tz.names());

    let USER = {
        ID: "45321",
        //ID: request.body.originalDetectIntentRequest.payload.data.message.chat.id,
        TIMEZONE: moment().tz("Africa/Johannesburg").format(),
        GENDER:"Male",
        LOCALE:"En",
        FIRST_NAME:"Kgothatso",
        //FIRST_NAME:request.body.originalDetectIntentRequest.payload.data.message.chat.first_name,
        LAST_NAME:"Curtlas",
        //LAST_NAME:request.body.originalDetectIntentRequest.payload.data.message.chat.last_name,
        PROFILE_PIC:"Not Picture"
    }
    
    cashbot.postGetQuery(USER.ID, { timezone: USER.TIMEZONE, gender: USER.GENDER, locale: USER.LOCALE, first_name: USER.FIRST_NAME, last_name: USER.LAST_NAME, profile_pic: USER.PROFILE_PIC })
    .then(function(res) {
        console.log("Testing...");
            
      console.log(res.messages[0].attachment.payload.elements);
      
    //   agent.add(new Card({
    //        title: 'Daily ',
    //       imageUrl: 'https://cdn.cashbot.ai/bot2bot/27-1.jpg',
    //       text: `One Game `,
    //       buttonText: '� Press Now �',
    //       buttonUrl: 'https://bots.cashbot.ai/load?refUserId=65494546&aid=1386&url=http%3A%2F%2Faffiliates.audiobooks.com%2Ftracking%2Fscripts%2Fclick.php%3Fa_aid%3D5bc766f64fc04%26a_bid%3D229e13d4&timestamp=1554066822409&b2bid=36&placement=0&type=1&hmac=4603588a3f3747cb7b562aa46b1517ad0deb291abd6a2d67a68f3e71cb1ee13d'

    //     })
    //   );
      
      
    })
    .catch(function(err) {
        console.log("==Err Handle==");
      console.log(err);
    })
	
})




// Spin up the server
app.listen(app.get("port"), function () {
    console.log("I am here at", app.get("port"));
});


