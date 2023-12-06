# Doran-Jarne-Tibo

## rekening houden met:

- Zwembad en onderhoud ervan
- Administratie
- Sportzalen - verhuur
- Kleedkamers / lokalen
- Catering / automaten
- Onderhoud gebouw
- poetsdienst


## env files

### API

[Generate Private Key](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)  
In docker-compose-production.yml, add the path to the private key in the secrets section.

[//]: # (```dotenv)

[//]: # (    GOOGLE_APPLICATION_CREDENTIALS=path-to-firebase-adminsdk.json)

[//]: # (```)

```dotenv
DB_HOST=localhost
DB_PORT=27031
DB_NAME=api
URL_FRONTEND=http://localhost:5173
NODE_ENV=development
```

### PWA 

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

```dotenv
# /packages/api/.env.production
DB_HOST=db
DB_PORT=27017
DB_NAME=api
URL_FRONTEND=http://localhost:8081
NODE_ENV=procuction
CLI_PATH=./packages/api/dist/cli.js
```

### PWA

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

## language utils

[Spreadsheet](https://docs.google.com/spreadsheets/d/16GYXaVcVnrA_K-XOY9DYLto1OKcnRWxJVT9WsYIdWz8/edit#gid=0)


### secret

[Google](https://console.cloud.google.com/apis/credentials/)

1. (create credentials > Create Oauth client Id > Choose for : Desktop App).
2. Download SportComplexApp json file

Save it as `oauthsecret.json` in `packages/pwa/src/utils/`

Add yourself as test user in 
[OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)

### run script

```shell
npm run language
```

## [seeding and clearing database](packages/api/seeding.md)

Seed database with all data
```bash
npm run seed -w packages/api
```

Reset database 
```bash
npm run reset -w packages/pwa
``` 
