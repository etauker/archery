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

## Deployment process
1. Develop new patches/features.
2. Commit completed code.
3. Push to heroku: `git push heroku master`.
4. If issues occur during/after deployment, correct them and force push to heroku master.
5. Tag next version locally: `git tag v{major}.{minor}.{patch}`.
6. Bump version to next development version.
7. Push to origin master: `git push origin master`.
8. Push tags to github: `git push --tags`.
