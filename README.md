# MongoDB-Express-NodeJS Todo App

## Description

Very simple todo app created for MongoDB, Express, Node.js exercise.

As the application will be very simple, frontend uses basic HTML, CSS, JS.

This backend logic can be easily integrated into Angular or React application.

[Frontend design sketch](https://www.sketch.com/s/b40bf7cd-eabe-4971-bc1d-bab6a4313583)

---

## Deploy

Heroku link: N/A

(Will be deployed on Heroku for full stack deployment exercise)

---

## Run Locally

### Prerequisite:
- node and npm must be installed

---

1. git clone the repository

```
git clone https://github.com/minhyeong-joe/MEN-todo-app.git
```
2. install node modules
```
npm install
```
3. Manually create config file `.env` with following template:
```
DB_URL=mongodb+srv://<username>:<password>@<host>/<db>?retryWrites=true&w=majority
DB_NAME=<db>
```
4. run node server
```c
node server.js

// optionally, you may use:
npm run dev
// to have nodemon watches and reloads server when changes are made
```