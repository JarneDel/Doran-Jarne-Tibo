# Doran-Jarne-Tibo

## rekening houden met:

- Zwembad en onderhoud ervan
- Administratie
- Sportzalen - verhuur
- Kleedkamers / lokalen
- Catering / automaten
- Onderhoud gebouw
- poetsdienst

## [seeding and clearing database](packages/api/seeding.md)

## env files

### API

[Generate Private Key](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
```env
    GOOGLE_APPLICATION_CREDENTIALS=path-to-firebase-adminsdk.json
```


### PWA 

[Get Firebase Config](https://console.firebase.google.com/project/_/settings/general/web)
```env
    VUE_APP_FIREBASE_API_KEY=<apiKey>
    VUE_APP_FIREBASE_AUTH_DOMAIN=<authDomain>
    VUE_APP_FIREBASE_DATABASE_URL=<databaseURL>
    VUE_APP_FIREBASE_PROJECT_ID=<projectId>
    VUE_APP_FIREBASE_STORAGE_BUCKET=<storageBucket>
    VUE_APP_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
    VUE_APP_FIREBASE_APP_ID=<appId>
    VUE_APP_FIREBASE_MEASUREMENT_ID=<measurementId>
```

Seed database with all data
```shell
 cd ./packages/api
 npx nestjs-command seed:database:all   
```

Seed database with stock data
```shell
 cd ./packages/api
 npx nestjs-command seed:database:stock    
```

Seed database with groups data
```shell
 cd ./packages/api
 npx nestjs-command seed:database:groups    
```

Seed database with loanableMaterials data
```shell
 cd ./packages/api
 npx nestjs-command seed:database:loanableMaterials   
```

clear All containers
```shell
 cd ./packages/api
 npx nestjs-command seed:reset:all
```

clear stock container
```shell
 cd ./packages/api
 npx nestjs-command seed:reset:stock    
```

clear groups container
```shell
 cd ./packages/api
 npx nestjs-command seed:reset:groups    
```

clear loanableMaterials container
```shell
 cd ./packages/api
 npx nestjs-command seed:reset:loanableMaterials    
```
