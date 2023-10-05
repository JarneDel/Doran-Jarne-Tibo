# seeding and clearing database

make sure to change directory first

```shell
cd ./packages/api
```

## Seed All

Seed database with all data

```shell
npx nestjs-command seed:database:all   
```

## Reset all

clear All containers

```shell
npx nestjs-command seed:reset:all
```

## Seed and reset separately

### Stock

Seed database with stock data
> Depends on
> - [groups](#groups)
> - [staff](#staff)

```shell
npx nestjs-command seed:database:stock    
```

clear stock container

```shell
npx nestjs-command seed:reset:stock    
```

### service

> Depends on
> - [staff](#staff)

seed database with services

```sh
npx nestjs-command seed:database:service
```

clear service container

```sh
npx nestjs-command seed:reset:service
```

### Staff

seed database with staff data

```bash
npx nestjs-command seed:database:staff
```

clear staff container

```bash
npx nestjs-command seed:reset:staff
```

### Groups

Seed database with groups data

```shell
npx nestjs-command seed:database:groups    
```

clear groups container

```shell
npx nestjs-command seed:reset:groups    
```

### LoanableMaterials

Seed database with loanableMaterials data

```shell
npx nestjs-command seed:database:loanableMaterials
```

clear loanableMaterials container

```shell
npx nestjs-command seed:reset:loanableMaterials    
```





