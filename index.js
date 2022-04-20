const config = require("./config.json");

const { Intents, Client } = require('discord.js');
const { getUser, userLikes, addTweets, addLikes, addRetweets, updateTweets, updateLikes, userRetweets } = require('./twitter_Api/twitter');


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })


client.on('messageCreate', async (message) => {
    if (message.content.startsWith("!likes")) {
        const messageArray = message.content.split(' ') // ["!likes", "username"]

        if (messageArray.length > 2) {
            message.reply("The command should look like this: !likes username")
            return
        }

        const username = messageArray[1]

        const user = await getUser(username)

        if (!user) {
            message.reply('User does not exist')
            return
        }
        message.reply('Let me do a quick search')

        const likedTweets = await userLikes(user.id)

        message.reply(`User @${username} liked ${likedTweets} tweets on Exothium`)
    }
    else if (message.content.startsWith("!retweets")) {
        const messageArray = message.content.split(' ') // ["!retweets", "username"]

        if (messageArray.length > 2) {
            message.reply("The command should look like this: !retweets username")
            return
        }

        const username = messageArray[1]

        const user = await getUser(username)

        if (!user) {
            message.reply('User does not exist')
            return
        }
        message.reply('Let me do a quick search')

        const retweets = await userRetweets(user.id)

        message.reply(`User @${username} retweets ${retweets} tweets on Exothium`)
    }

    else if (message.content === "!insertTweets" && message.member.roles.cache.has(config.ADMIN_ROLE_ID)) {
        await addTweets()
        message.reply("Tweets added into the Database")
    }
    else if (message.content === "!insertLikes" && message.member.roles.cache.has(config.ADMIN_ROLE_ID)) {
        await addLikes()
        message.reply("Likes added into the Database")
    }
    else if (message.content === "!insertRetweets" && message.member.roles.cache.has(config.ADMIN_ROLE_ID)) {
        await addRetweets()
        message.reply("Retweets updated successfuly")
    }
    else if (message.content === "!updateTweets" && message.member.roles.cache.has(config.ADMIN_ROLE_ID)) {
        await updateTweets(config.TWITTER_PAGE_ID)
        message.reply("Tweets updated successfuly")
    }
    else if (message.content === "!updateLikes" && message.member.roles.cache.has(config.ADMIN_ROLE_ID)) {
        await updateLikes()
        message.reply("Likes updated successfuly")
    }
})


client.on('ready', () => {

    // Get all the commands from the server and create your own
    const guild = client.guilds.cache.get(config.GUILD_ID)

    /*let commands;
    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands.create({
        name: 'twitter',
        description: 'Checks whether the user liked or not a tweet.',
        options: [
            {
                name: 'username',
                description: 'User\'s @ on Twitter',
                required: true,
                type: 3
            }
        ]
    })*/
    console.log('Bot is ready')
})

client.login(config.DISCORD_TOKEN)