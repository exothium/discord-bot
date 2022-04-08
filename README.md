# Discord-Twitter

This discord bot is currently checking how many tweets a user liked on Twitter account

# Installation

```bash
cd ./repository
npm install
# or
yarn install
```

Run `!insertTweets` and `!insertLikes` to get all the tweets and likes into the database, respectively.
Every time you wanna see how many likes a user has on that page, run the following command:

``sh
!twitter *username*
``

# Variables
To make this bot work, you'll need to set up some variables first, you can create a `config.json` file inside the root of your repository with the following JSON as an example:

```json
{
    "DB_HOST": "string",
    "DB_USER": "string",
    "DB_PORT": 1234,
    "DB_PASSWORD": "string",
    "DB_SCHEMA": "string",

    "TWITTER_TOKEN": "string",
    "TWITTER_PAGE_ID": "string",
    
    "DISCORD_TOKEN": "string",
    "GUILD_ID": "string"
}
```

#### Database (MySQL 8.0)
The variables that start with DB are the ones for your database, the host, user credentials, port and the database schema itself.

#### Twitter
To get the Twitter API Bearer token you'll need to register on Twitter Developers website, create an app and copy your token.
 To get the account id, you'll need to use endpoint `https://api.twitter.com/2/users/by/username/:username` using your username which will return the following JSON (if the user exists):

```json
{
    "data": {
        "id": "id_String",
        "name": "name_String",
        "username": "username_String"
    }
}
```

#### Discord
The same thing goes for Discord, you'll need to create an app on Discord Developers website and the token itself.   

You might be wondering, what's a guild? In Discord.js, a guild is considered a server. For example a user guild array is an array with all the users of that Discord server.

To get the Guild ID, you'll need to enable Developer Mode on your Discord by going to `Settings -> Advanced -> Developer Mode`. After that right click on your Discord Server on your list and select `Copy ID`.

And that's it!