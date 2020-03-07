# Css Node Server - Bootstrap template

## Preferred IDE:

Visual Studio Code.

## Min Extensions required:

a) Beautify
b) Prettier
c) ESLint

## IDE Settings:

Inside /.vscode/settings.json, basic settings required for this project is stored.

## git repo:

https://github.com/manisha-css/css-nodeserver

## Features developed

- Initialization
- Health check
- CORS
- Continuous running of the server + debugging
- Code Format & Code quality
- Pre commit hook
- Logging
- Exception handling – more testing is required
- Environment
- Documentation
- I18n / message resources
- User Module
  a) User Registration - TODO - change to userdto class
  b) Verification by sending code to registered email
  c) Re-Send Verification code
  d) Forget password
  e) Login (JWT Authentication + Role based authorization -- TODO EXPIRY CHECK)
  f) Logout
  g) My Profile
  h) Change password
- Contact Us module

## Prerequisite:

- node/npm/angular-cli is already installed.
- I have tested using node v10.16.0 and npm v6.9.0.
- Project has been created using angular-cli version 8.0.3
- Visual Studio Code (Mine is Version 1.36.1)

## Steps to run:

1. clone it to your project directory
2. Create database - run following 2 scripts
   /dbscripts/db-schema.sql
   /dbscript/db-seeddata.sql
3. Copy env.example to .env file and change the values as per your environment
   For email SMTP - Currently using gsmtp. So please enter your gmail account details. Also you will need to turn on "Less Secure" app
4. Open in IDE
5. At Project root
   \$ npm install

6. To run locally with inspect
   \$ npm run start_env_inspect

7. To run locally without inspect
   \$ npm run start_env

8. Node server will be running on http://localhost:3000
