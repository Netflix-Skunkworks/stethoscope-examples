# Stethoscope examples

This is a small [Express](https://expressjs.com/) server with examples of:

* querying the Stethoscope app for device information and policy compliance
* reporting device and policy information along with a username
* blocking access to pages if the device hasn't recently passed the check

## First, run the Stethoscope app

Check out the [Stethoscope app](https://github.com/Netflix-Skunkworks/stethoscope-app) repo and run:

    npm install
    npm run build:react
    NODE_ENV=development npm run electron

In development mode, the Stethoscope app will accept CORS requests from localhost, which is necessary for this example server to work.

## Install dependencies and run the example server

    npm install
    npm start

...then open http://localhost:3000
