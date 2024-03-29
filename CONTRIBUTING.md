# Contribute

## Development Environment Setup

### Initial setup Github Codespaces

1. Open the Github repository in the browser, click on Code -> Codepsaces -> New Codespace

### Initial setup Business Application Studio

1. Open [Business Application Studio](https://xxx.eu10cf.applicationstudio.cloud.sap) and login with your mail and S-User Password
2. Create a new Development Space of type `SAP Cloud Business Application`
3. Create a new workspace for example `projects`
4. Clone Respository
5. Set your username: `git config --global user.name "FIRST_NAME LAST_NAME"`
6. Set your email address: `git config --global user.email "MY_NAME@itelligence.de"`
7. Open repository folder: `cd cap-bestpractices`
8. Install dependencies: `npm run install:all`

#### Install Extension

1. Find URL of vsix file
2. Press F1
3. Deploy Plugin by Id aufrufen
4. Insert URL and hit Enter

#### Reopen Port Preview

1. Press F1
2. Type `Ports:Preview`
3. Press ENTER
4. Select Port

### Initial setup Windows

1. Install Visual Studio Code
2. Clone Repository
3. Open repository folder: `cd cap-bestpractices`
4. Install dependencies: `npm run install:all`
5. Set git bash as npm shell `npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"`

If you want to use pre-commit hooks:

1. Install python 3 and pip
2. Install pre commit `pip install pre-commit`
3. Initialize the pre-commit hook in the root directory of the project `pre-commit install`

If you want to deploy from you local PC:

1. Install the Cloud Foundry CLI
2. Install the multiapps plugin `cf install-plugin multiapps`

### Development

#### Start development server with in memory database

**Not all features are supported with in memory sqlite database!**

1. Start backend watch server in first terminal with in memory database: `npm run watch`
2. To access the frontend and backend use user `admin` and password `1234`

#### Start development server with sqlite database

**Not all features are supported with sqlite database!**

1. Start backend watch server in first terminal with sqlite database: `npm run watch:sqlite`
2. Create `default-env.json` in `app` folder with credentials for XSUAA Service
3. Start approuter in second terminal: `cd app && npm run start`
4. To access the frontend and backend use your email adress and S-User password
5. You can use the database explorer (_Left Bar > SQLTools_) with following setting
   - Type: SQLite
   - Connection Name: Any Name
   - Database File: `sqlite.db`
6. To reset the database delete the databse file: `rm sqlite.db`

#### Start development server with HANA database

**If the schema was changed you have to deploy the database first with: `npm run deploy:hana`**

1. Create `default-env.json` in repository folder with credentials for BTP Cloud Foundry Services
2. Copy `default-env.json` to folder `app`
3. Start backend watch server in first terminal with in memory database: `npm run watch:hana`
4. Start approuter in second terminal: `cd app && npm run start`
5. To access the frontend and backend use your email adress and S-User password
6. You can use the database explorer (_Left Bar > SQLTools_) with following setting
   - Type: HANA
   - Connection Name: Any Name
   - Connection Method: Server and Port
   - Server host: Use VCAP_SERVICE>hana>credentials>host of `default-env.json`
   - Port: Use VCAP_SERVICE>hana>credentials>port of `default-env.json`
   - User: Use VCAP_SERVICE>hana>credentials>user of `default-env.json` (NOT hdi_user)
   - Password: Use VCAP_SERVICE>hana>credentials>password of `default-env.json` (NOT hdi_password)
7. You can use the full featured [HANA Database Explorer](https://hana-cockpit.cfapps.eu10.hana.ondemand.com/hrtt/sap/hana/cst/catalog/cockpit-index.html) of SAP Cloud Platform Cockpit

#### Start Mockserver for external services

1. Start watch server in additional terminal with: `npm run watch:mockserver`

## Git Workflow

We will use the [Github-Flow](https://guides.github.com/introduction/flow/)

### Start a new Feature / Fix a Bug

There's only one rule: anything in the main branch is always deployable. Because of this, it's extremely important that your new branch is created off of main when working on a feature or a fix. Your branch name should be descriptive (e.g., refactor-authentication, user-content-cache-key, make-retina-avatars), so that others can see what is being worked on.

1. Make sure you are on the main branch and it is up to date with the remote `git checkout master && git pull`
2. Create a new Branch: `git checkout -b my-new-branch`
3. Add specific or all changes to commit: `git add .`
4. Check your changes against the pre-commit rules `pre-commit`
5. Commit your changes: `npm run commit`
6. Push your branch into Github: `git push origin my-new-branch`

### Finish a feature

1. Wait for the CI/CD Pipeline to finish
2. Go to [Github](https://github.com/quadrio/xxx) an create a merge request for your branch into the main branch

## CI/CD Pipeline (Github Actions)

After each commit a CI/CD pipeline is started. All steps are executed in containers.

### For all Branches except main (`commit.yml`)

**Runs only if dependency in package-lock.json was changed**

1. Installs all npm packages and uploads them into the cache
2. eslint checks for frontend are run locally
3. Unit tests for frontend are run locally
4. eslint checks for backend are run locally
5. Unit tests for backend are run locally
6. API tests for backend with sample data are run locally
7. The licences of all dependencies are checked
8. The repository is checked for commited secrets

### For main branch (`main.yml`)

#### Stage versioning

1. Current version is read from `package.json`
2. Based on last commit messages a new major or minor version is created and written to `package.json` and `mta.yaml`
3. `CHANGELOG.md` is updated with commit messages
4. A Git Tag is created and pushed into the repository

#### Stage build

1. MTA file is created without sample data
2. MTA file is uploaded into artifact repository

#### Stage test deployment

1. MTA file is downloaded from artifact repository
2. MTA file is deployed to NUBO Time Recording Test Space with blue-green deployment and automatic release

#### Stage production idle deployment

1. MTA file is downloaded from artifact repository
2. MTA file is deployed to NUBO Time Recording Production Space with blue-green deployment

#### Stage production idle smoke test

1. Some basic tests are done against the new productive version

#### Stage production release

1. The productive idle version is release as live version
2. The old productive live version is deleted

#### Stage production smoke test

1. Some basic tests are done against the new productive version

## Tests

Run all tests with `npm run test:all`

### Backend

#### Eslint

`npm run lint`

#### Mocha

`npm run test`

#### Troubleshoot

Follow this guideline to trouble-shoot failing backend tests.

- Check the CI-LOG
- Make sure local demo-data is up to date
- Add the string 'it.only.(..)' to the it
- Boot a cap instance with debug.
- Run `npm run test`. Only parts marked with .only will be executed, requesting the already running backend with debug session.
- check Troubleshoot - CI

### Frontent

For compatibility reasons with the business application studio. All UI tests and their dependencies are in their own npm package located in "test".

#### Eslint

`cd app && npm run lint`

#### Tests

Currently it is not possible to execute in business application studio.

> headless: `cd app/test && npm run test:ci`

If you want to run one `describe`/`it` statement ADD anywhere in the description the word `#dev`.

Currently it is only possible to execute the tests with display on a local machine

> with display: `cd app/test && npm run test:dev`

#### Troubleshoot

Follow this guideline to trouble-shoot failing ui tests.

- Check the CI-LOG
- Check, if there is a screenshot available in the artifacts '/artifacts/browse/app/test/allure-report/data/attachments/' .png files. You can also download the entire report and view it locale with any localhost server.
- If integration test. Run the test manual e.g. login with the test-user to the integration test app instance.
- Add the string '#dev' to the it description and run `cd app/test && npm run test:dev` local
  - you can also add `browser.pause(9999)` or `browser.debug()` in the spec files to stop execution at any point
  - Make sure local demo-data is up to date
- If integration test. You can debug a hana base application instance
  - select stop on exception
  - run test local against this hana instance. see comment in wdio.conf.base.js to test towards and remote url.
- check Troubleshoot - CI

## Troubleshoot - CI

- delete all package-lock.json and rerun `npm i`
  - commit your new lock files and push.
- Especially if error occurs in sap npm modules. Update all npm dependencies
  - you can use <https://www.npmjs.com/package/npm-check-updates>
  - redo clear all ci runner caches.
  - commit & push update package.json and lock files

## Test Data

- Test data is generated by using the JSON files inside `srv/data/source`
- Generate Test Data:
  `npm run data:dev`
- Generate Production Data:
  `npm run data:prod`

## Deployment

### Deploy from development environment to Cloud Foundry

1. reate file `mta_local.mtaext` with content (only one of bestpractices-dev/bestpractices-test/bestpractices):

   ```yaml
   _schema-version: '3.1'
   ID: bestpractices-conf
   extends: bestpractices
   parameters:
     MTA_ENV: bestpractices-dev/bestpractices-test/bestpractices
   ```

2. Set cloud foundry target to correct space f.e. `cf target -o xxxx -s bestpractices`
3. Build and deploy WITHOUT test data: `npm run build-deploy:prod` or WITH test data: `npm run build-deploy:dev`

### DB Auto Undeployment

1. Set cloud foundry target to correct space f.e. `cf target -o xxxx -s cap-bestpractices`
2. Build and deploy `npm run deploy:hana`
3. Add flag `--auto-undeploy` to start script in `gen/db/package.json` once it is generated and before deployment start

## Code Style Guide

The [standardJS](https://standardjs.com/) Code Style Guide is used

### Naming Conventions General

#### Variables

- Start variable names with a letter, use **camelCase** for names
- Variable names should be self-descriptive, describing the stored value
- Boolean variables are usually prefixed with is or has

#### Functions

- Start function names with a letter, use camelCase for names
- Use descriptive names, usually verbs in the imperative form
- Common prefixes are get, make, apply etc
- Class methods follow the same rules

#### Constant

- Define constants at the top of your file, function or class
- Sometimes UPPER_SNAKE_CASE is used, while other times plain camelCase

#### Classes

- Start class names with a capital letter, use PascalCase for names
- Use descriptive names, explaining the functionality of the class

### Private

- Prefix any variable or function with \_ to show intention for it to be private.
- As a convention, this will not prevent other parts of the code from accessing it.

### Naming Conventions UI5 Applications

- HTML element IDs starting with `sap-ui- are` reserved for SAPUI5
- DOM attribute names starting with `data-sap-ui-`
- URL parameter names starting with `sap-` and `sap-ui-` are reserved for SAPUI5.

### Domain Modeling

Stick to the [SAP CAP Guide](https://cap.cloud.sap/docs/guides/domain-models#naming-conventions)

- Start entity and type names with capital letters
- Use plural form for entities - for example, Authors
- Use singular form for types - for example, Genre
- Start elements with a lowercase letter - for example, name
- Don’t repeat contexts → e.g. Author.name instead of Author.authorName
- Prefer one-word names → e.g. address instead of addressInformation
- Use ID for technical primary keys → see also Use Canonic Primary Keys
- Prefer Single-Purposed Services \
   We strongly recommend designing your services for single use cases. Services in CAP are cheap, so there’s no need to save on them. [Refer to CAP Guide](https://cap.cloud.sap/docs/guides/providing-services#prefer-single-purposed-services)

### File Structure

- File names must be all lowercase and may include dashes (-)

#### Services and Service Handlers

The easiest way to add service implementations is to simply place equally named .js files next to the .cds files containing the respective service definitions. In addition to direct siblings you can place them into relative subdirectories ./lib or ./handlers, allowing layouts like that:

```text
srv/
  # all in one
  foo-srv.cds
  foo-srv.js
  bar-srv.cds
  bar-srv.js
```

#### Apps

In case of only a single UI, the UI should be placed in the `app/webapp` folder. If there are multiple Apps, create one folder per app inside the `app` folder and name it accordingly to the app function.

#### Database

- The database schema is defined in the `db/schema.cds` file
- Mockdata is generated from JSON files using the functionalities provided in the `srv/data` folder
- Data inside the folder `db/csv` will be deployed to production
- Data inside the folder `db/data` is only for development puposes
- Data inside the folder `db/data` is only for development puposes
