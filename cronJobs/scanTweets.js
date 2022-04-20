const config = require("../config.json");

const { Intents, Client } = require('discord.js');
const { getUser, userLikes, addTweets, addLikes, addRetweets, updateTweets, updateLikes } = require('../twitter_Api/twitter');

const db = require("../twitter_Api/database/connection");

async function scanTweets() {
    await addTweets();
    await addLikes();
    await addRetweets();
    db.end();
    console.log('tweets scanned and added to DB');
}

scanTweets();