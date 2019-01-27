## Deployment Process

### Seting up a new environment
1. Check if dependencies are installed: `node --version && npm --version && git --version`

### Creating a new app
1. Create a new app in https://dashboard.heroku.com/new-app or by running: `heroku apps:create {name} --region eu`
2. Log in: `heroku login`
3. `heroku ps:scale web=1`
4. `heroku open`

### Removing tags
1. Remove a tag locally using: `git tag --delete {tag}`
2. Remove a tag on github using: `git push --delete origin {tag}`

## Deploying to heroku
1. Upgrade heroku to hobby tier or higher: `heroku ps:resize web=hobby`
2. Enable SSL Certificates: `heroku certs:auto:enable` https://devcenter.heroku.com/articles/automated-certificate-management

## Deployment process
1. Develop new patches/features.
2. Commit completed code.
3. Push to heroku: `git push heroku master`.
4. If issues occur during/after deployment, correct them and force push to heroku master.
5. Tag next version for each sub-project locally: `git tag v{major}.{minor}.{patch}`.
Backend/frontend dependencies should always have the same version as their parent project.
e.g. `com.etauker.glucose.charts/frontend` and `com.etauker.glucose.charts/backend` should have the same version as `com.etauker.glucose.charts`.
6. Tag next version of the product locally: `git tag v{major}.{minor}.{patch}`.
If a minor version of any of the dependencies was bumped, bump the minor version of the product.
If a major version of any of the dependencies was bumped, bump the major version of the product.
7. Bump version to next development version.
8. Push to origin master: `git push origin master`.
9. Push tags to github: `git push --tags`.

## Rolling Back Deployments
```
heroku releases
heroku rollback {release}
```
