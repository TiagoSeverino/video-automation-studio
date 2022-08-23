# Server

## Create Bot

https://discord.com/developers/applications

## Add Bot To Server

https://discordapp.com/oauth2/authorize?client_id=<Bot_Client_ID>&scope=bot&permissions=0

## Create Docker Container

docker build -t video-automation-studio .

## Start Docker Container

docker run -d --restart unless-stopped video-automation-studio
