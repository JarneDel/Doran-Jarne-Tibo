# Doran-Jarne-Tibo

## rekening houden met:

- Zwembad en onderhoud ervan
- Administratie
- Sportzalen - verhuur
- Kleedkamers / lokalen
- Catering / automaten
- Onderhoud gebouw
- poetsdienst

## seeding and clearing database

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
 npx nestjs-command seed:database:loanablematerials   
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
