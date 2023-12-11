# Doran-Jarne-Tibo

## Requirements

- Firebase
- Docker
- Node.js

## [API - Readme](packages/api/README.md)

## [PWA - Readme](packages/pwa/README.md)

## Setup project locally

### env files

#### API

Firebase Admin Token
[Generate Private Key](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)  
In docker-compose-production.yml, add the path to the private key in the secrets section.

```dotenv
GOOGLE_APPLICATION_CREDENTIALS=path-to-firebase-adminsdk.json
# Mail is required for signing up staff members, not needed to start the app,
MAIL_USER=email@hotmail.com
MAIL_PASSWORD=password
MAIL_PROVIDER="email provider (outlook, ...)"
```

```dotenv
DB_HOST=localhost
DB_PORT=27031
DB_NAME=api
URL_FRONTEND=http://localhost:5173
NODE_ENV=development
```

#### PWA

[Get Firebase Config](https://console.firebase.google.com/project/_/settings/general/web)

```dotenv
VUE_APP_FIREBASE_API_KEY=<apiKey>
VUE_APP_FIREBASE_AUTH_DOMAIN=<authDomain>
VUE_APP_FIREBASE_PROJECT_ID=<projectId>
VUE_APP_FIREBASE_STORAGE_BUCKET=<storageBucket>
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
VUE_APP_FIREBASE_APP_ID=<appId>
VUE_APP_FIREBASE_MEASUREMENT_ID=<measurementId>
```

```dotenv
VITE_API_URL=http://localhost:3000
```

### prod env files

#### api

```dotenv
# /packages/api/.env.production
DB_HOST=db
DB_PORT=27017
DB_NAME=api
URL_FRONTEND=http://localhost:8081
NODE_ENV=procuction
CLI_PATH=./packages/api/dist/cli.js
```

#### PWA

[Get Firebase Config](https://console.firebase.google.com/project/_/settings/general/web)

```dotenv
# packages/pwa/.env.production.local
VUE_APP_FIREBASE_API_KEY=<apiKey>
VUE_APP_FIREBASE_AUTH_DOMAIN=<authDomain>
VUE_APP_FIREBASE_DATABASE_URL=<databaseURL>
VUE_APP_FIREBASE_PROJECT_ID=<projectId>
VUE_APP_FIREBASE_STORAGE_BUCKET=<storageBucket>
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
VUE_APP_FIREBASE_APP_ID=<appId>
VUE_APP_FIREBASE_MEASUREMENT_ID=<measurementId>
```

```dotenv
VITE_API_URL=http://localhost:3000
```

### language utils

[Spreadsheet](https://docs.google.com/spreadsheets/d/16GYXaVcVnrA_K-XOY9DYLto1OKcnRWxJVT9WsYIdWz8/edit#gid=0)

#### secret

[Google](https://console.cloud.google.com/apis/credentials/)

1. (create credentials > Create Oauth client Id > Choose for : Desktop App).
2. Download SportComplexApp json file

Save it as `oauthsecret.json` in `packages/pwa/src/utils/`

Add yourself as test user in 
[OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)

### run language script

```shell
npm run language
```

### [seeding and clearing database](packages/api/seeding.md)

Seed database with all data
```bash
npm run seed -w packages/api
```

Reset database 
```bash
npm run reset -w packages/pwa
``` 

### Start project in dev mode

```bash
cd infra
docker compose -f ./docker-compose-dev.yaml up -d
npm run dev
```

### Start project in production mode

```shell
cd infra
docker compose -f ./docker-compose-production.yaml up 
```

## E2E Testing

setup emulators

```bash
npm run dev:emulate
```

Run tests

```shell
npm run test -w pwa
```

## Unit Testing

```shell
npm run test -w api
```
