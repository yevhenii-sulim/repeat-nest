## Description

## Project setup

```bash
$ git clone https://github.com/yevhenii-sulim/repeat-nest.git
$ cd repeat-nest
$ npm i -g @nestjs/cli
$ npm install

```

## Compile and run the project

```bash
# development
create .env

then fill in it

POSTGRES_DB=mydb
POSTGRES_USER=myUser
POSTGRES_PASSWORD=myPass
POSTGRES_PORT=5432
REDIS_PORT=6379

you have to have docker (set up if there is no)
(linux)
$ npm run docker:build
$ npm run docker:start
$ npm run prisma:gen
$ npm run prisma:migration -- ${name}
$ npm start


# watch mode
$ npm start

# production mode
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

## Resources

```dockerDb

$ sudo docker exec -it db psql -U myuser -d mydb

```

## Support

## Stay in touch

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

// "exec": "npm run build && node dist/main.js" -
