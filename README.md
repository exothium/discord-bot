# Discord-Twitter

This discord bot is currently checking whether a user liked or not a specific tweet on Twitter

## Installation


```bash
cd ./repository
npm install
# or
yarn install
```

# Environment variables
To make this bot work, you'll need to set up some variables first, you can create a config.json file inside the root of your repository with the following JSON as an example:

```json
{
    "DB_HOST": "string",
    "DB_USER": "string",
    "DB_PORT": 1234,
    "DB_PASSWORD": "string",
    "DB_SCHEMA": "string",

    "TWITTER_TOKEN": "string",
    "TWEET_ID": "string",
    "TWITTER_PAGE_ID": "string",
    
    "DISCORD_TOKEN": "string",
    "GUILD_ID": "string"
}
```