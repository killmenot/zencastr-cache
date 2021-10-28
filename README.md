## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### API

NOTES:
 - TTL should be passed via headers (x-ttl) and must be milliseconds (1000 = 1s) except setting values for multiple keys

1. Get the list of all keys `GET /storage/list`
2. Get the value for key `GET /storage/keys/:id`
3. Get the ttl value for key `GET /storage/keys/:id/ttl`
4. Set the value for key `PUT /storage/keys/:id`, payload -> value
5. Set the ttl value for existing key `PUT /storage/keys/:id/ttl`, no payload needed
6. Get values for multiple keys `GET /storage/mkeys?ids[]=key1&ids[]=key2`
7. Set values for multiple keys `PUT /storage/mkeys`. payload must be `[ { key: 'string', value: any, ttl?: number } ]`
8. Delete value for the key `DELETE /storage/keys/:id`
8. Delete values for multiple key `DELETE /storage/mkeys?ids[]=key1&ids[]=key2`
9. Delete values for all key `DELETE /storage/flush`
