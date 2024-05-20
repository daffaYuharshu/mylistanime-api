# MyListAnime-API

This is MyListAnime API application built using Node.js. Make sure you have already installed Node.js in your system.
This service using PostgreSQL as the database, so you need to install PostgreSQL and create database "mylistanime" in PgAdmin4.

## How to run this Application
1. Clone the repository after that open it using your code editor
2. In the root directory of this project, make a new file named .env to provide the configurations needed.
3. Copy these details into .env file:
```
# No need to change
DATABASE_URL="postgresql://postgres:{dbpassword}@localhost:5432/mylistanime"
SESSION_SECRET="MYTOPSECRETWORD"
MY_SECRET="MYTOPSECRETWORD"
```
4. Open terminal in the project root directory, then run `npm install` to install the application dependencies.
5. After that, run `npx prisma init --datasource-provider postgresql` and `npx prisma migrate dev`.
6. cd to `/src` directory and run the application using node `node index.js`.
7. The server will run in localhost with the port 3000, open [http://localhost:3000](http://localhost:3000) in your browser.
8. if it doesn't show any errors and pop up `Cannot GET /` then you successfully run the service.

For the API documentation you can check from this link:
- [mylistanime/api-docs](https://mylistanime-docs.vercel.app/)

