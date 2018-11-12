## Deployment Process

### Seting up a new environment
1. Check if dependencies are installed: `node --version && npm --version && git --version`

### Creating a new app
1. Create a new app in https://dashboard.heroku.com/new-app or by running: `heroku apps:create {name} --region eu`
2. Log in: `heroku login`
3. `heroku ps:scale web=1`
4. `heroku open`

## Deploying to heroku
1. Upgrade heroku to hobby tier or higher: `heroku ps:resize web=hobby`
2. Enable SSL Certificates: `heroku certs:auto:enable` https://devcenter.heroku.com/articles/automated-certificate-management
