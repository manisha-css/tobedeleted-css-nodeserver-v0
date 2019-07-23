# CssNodeServer

##IDE:
Visual Studio Code.

##Min Extensions required:
Beautify
Prettier
ESLint

##IDE settings.json
Either global settings or project specific under /.vscode/settings.json)

{
"workbench.colorTheme": "Default Light+",
"gitlens.advanced.messages": {
"suppressShowKeyBindingsNotice": true
},
"typescript.updateImportsOnFileMove.enabled": "always",
"window.zoomLevel": 0,
"editor.hover.enabled": false,
"[typescript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[json]": {
"editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[jsonc]": {
"editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[css]": {
"editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[html]": {
"editor.defaultFormatter": "HookyQR.beautify"
},
"editor.formatOnSave": true,
"vsicons.projectDetection.autoReload": true,
"npm.enableScriptExplorer": true
}

#Node Bootstrap:

##git repo:
https://github.com/manisha-css/css-nodeserver

#Features included

- Initialization
- Health check
- CORS
- Continuous running of the server + debugging
- Code Format & Code quality
- Pre commit hook
- Logging
- Exception handling – TODO more testing is required
- Environment
- Documentation
- I18n / message resources
- JWT Authentication
- Role based authentication
- Auth guards
- User Module
  User Registration
  Verification by sending code to registered email
  Re-Send Verification code
  Forget password
  Login (JWT Authentication)
  Logout
  My Profile
  Change password
- Contact Us module

# Setting up

## Prerequisite:

- node/npm/angular-cli is already installed.
- I have tested using node v10.16.0 and npm v6.9.0.
- Project has been created using angular-cli version 8.0.3
- Visual Studio Code (Mine is Version 1.36.1)

## Steps:

1. clone it to your project directory
2. Open in IDE
3. At Project root
   \$ npm install

4) To run locally with inspect
   \$ npm run start_env_inspect

5) To run locally without inspect
   \$ npm run sstart_env_inspect

6) Node server will be running on http://localhost:3000
