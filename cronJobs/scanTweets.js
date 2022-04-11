const config = require("../config.json");

const { Intents, Client } = require('discord.js');
const { getUser, userLikes, addTweets, addLikes, updateTweets, updateLikes } = require('../twitter_Api/twitter');

async function scanTweets() {
    await addTweets();
    await addLikes();
    console.log('tweets scanned and added to DB');
}

scanTweets();