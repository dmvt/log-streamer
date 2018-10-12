# log-streamer

A very simple server to stream a log file over websocket.

Heavily inspired by https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61

## Questions?

In that case, don't use this yet... I'll get around to a write up soon, but it's really simple :-P

## Usage

Install all of the required packages
```
npm install
```

Now you can run the application
```
LOG_FILE=[path to file] npm start
```

And visit the website `http://[your server]:4000`

## NPM scripts

 - `npm run lint`: Run the typescript linter
 - `npm run start`: Run the application in the foreground
 - `npm run stop`: Stop any running daemons
