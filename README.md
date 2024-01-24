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

Under the hood, when a register request comes in, The backend hashing password and creating a user in postgres with given informations. On the login request, the backend checking password with hash and giving if passwords matches, hashing user without 'password' field and returning a response including jwt and cookies; `{ token: 'eyJ...'}`

cookies that include the token.
`cookie name: jsonwebtoken`
`cookie value: eyJ...`

#### Authorization

I needed to implement authorization to prevent security issues.
Only the correct user (who's added the indexes) can add index for its company or remove.

### Tech Stack

- TypeScript
- ExpressJS
- Postgres
- TypeORM
- AWS ECR
- ⁠AWS ECS (Fargate)

## Why I used This Stack?

With TypeScript, TypeORM provides a strong typing system, ensuring that database interactions are type-safe and reducing runtime errors.TypeORM simplifies database operations by allowing developers to work with objects and classes instead of raw SQL queries, making code more readable and maintainable.

I have prior experience working with PostgreSQL, which influenced my decision to use it in this project. This familiarity allows me to work efficiently with the database, design optimal schemas, and leverage advanced features effectively.

#### Deployment

Github Actions is provides fast and easy way to create pipelines. I can publish image to ECR and deploy to ECS on a fargate instance. ECS enables us to scale app to some point where we need to Kubernetes.

## What to Improve?

There are a lot of things to improve but due to task complete time limit I'm not able to do them all.

- Backend:
  - It would be very nice to have a swagger documentation.
