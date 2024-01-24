# Apollo Iot Task

### How to run?

You must have [Docker](https://www.docker.com/) installed on your machine.

```
docker-compose up -d --build
```

Navigate to <b>http://localhost:3000/signup</b>

After succesfully registered, Login with same credentials and tada! 🎉 You are able to create your indexes and can see your consumptions ⚡️🕘.

## How it works

#### Authenticaion

Under the hood, when a signup request comes in, The backend hashing password and creating a user in postgres with given informations. On the login request, the backend checking password with hash if passwords matches, returning a response including jwt and cookies; `{ token: 'eyJ...'}`

cookies that include the token.
`cookie name: jsonwebtoken`
`cookie value: eyJ...`

#### Authorization

I needed to implement authorization to prevent security issues.

#### Adding Index

First of all, backend checking the value of the index.If the value is negative, we are returning a response with a status code of 400.

After that we are checking the userIds.
If the currently authenticated user's id `(retrieved from req.user)`
isnt mathing with the userId variable we are logging the user out and response with status code of 403.

When an index added both `Consumption` and `Index` tables are filling in.
User added the first index, we are filling the `ındex Table` but `NOT` `Consumption Table`. Becasue we cannot calculate the Consumption with 1 index.
When user added another index, we will be filling the `Consumption` table and the `Index Table`. Now we have the consumption, and the 2 indexes 😊

We also have another case;
We must distribute the consumption values equally when we have a date range like:
If we add index on Feb 1 with value of 100 and another index on Feb 3 with value of 500, the consumptions for Feb 1 and Feb 2 must be distributed equally 200-200.

### Tech Stack

- TypeScript
- ExpressJS
- Postgres
- TypeORM
- AWS ECR
- ⁠AWS ECS (Fargate)

## Why I used This Stack?

#### Db and ORM

With TypeScript, TypeORM provides a strong typing system, ensuring that database interactions are type-safe and reducing runtime errors.TypeORM simplifies database operations by allowing developers to work with objects and classes instead of raw SQL queries, making code more readable and maintainable.

I have prior experience working with PostgreSQL, which influenced my decision to use it in this project. This familiarity allows me to work efficiently with the database, design optimal schemas, and leverage advanced features effectively.

#### Deployment

Github Actions is provides fast and easy way to create pipelines. I can publish image to ECR and deploy to ECS on a fargate instance. ECS enables us to scale app to some point where we need to Kubernetes.

## What to Improve?

- Backend:
  - It would be very nice to have a swagger documentation.
