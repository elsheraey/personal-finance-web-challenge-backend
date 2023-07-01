# personal-finance-web-challenge-backend

This is the backend repository for the personal finance web challenge found [here](https://github.com/elsheraey/personal-finance-web-challenge).

## How to run locally

- Make sure you have nodejs and npm installed
- Make sure you've PostgreSQL installed and running
- Create a PostgreSQL database
- Follow `.env.example` to create an `.env` file
- `npm install`
- `npx prisma migrate dev`
- `npm run start:dev`
- Services should be running on `http://localhost:3001`
- You can use [Insomnia](https://insomnia.rest/) and import this collection to test the services [here](./insomnia.json)

For more information about services built with NestJS starter, the original README.md can be found [here](./getting-started.md)
