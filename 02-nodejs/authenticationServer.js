/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
app.use(express.json())
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

let users = []
app.post('/signup', (req, res) => {
  // const {username,password,lastname,firstname}=req.body;
  const user = req.body;
  let existingUser = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === user.email) {
      existingUser = true;
      break;
    }
  }
  if (existingUser) {
    res.status(400).json("user already exist")
  } else {
    users.push(user)
    res.status(200).json({
      "message": "user added successflly"
    })
  }
})

app.post("/login", (req, res) => {
  var user = req.body;
  let userFound = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === user.email && users[i].password === user.password) {
      userFound = users[i];
      break;
    }
  }


  if (userFound) {
    res.status(200).json({
      firstname: userFound.firstname,
      lastname: userFound.lastname,
      email: userFound.email,
    })
  } else {
    res.status(400)
  }
});

// app.get('/data', (req, res) => {
//   let email = req.headers.email;
//   let password = req.headers.password;

//   let userFound = false;

//   for (let i = 0; i < users.length; i++) {
//     if (users[i].email === email && users[i].password === password) {
//       userFound = true;
//       break;
//     } else {
//       res.status(400).json({
//         message: "user invalid"
//       })
//     }

//     if (userFound) {
//       let usersList = []
//       for (let i = 0; i < users.length; i++) {
//         usersList.push({
//           email: users[i].email,
//           firstname: users[i].firstname,
//           lastname: users[i].lastname
//         })
//       }
//     } else {
//       res.sendStatus(401)
//     }
//   }
// })

app.get('/data', (req, res) => {
  const email = req.headers.email;
  const password = req.headers.password;

  let userFound = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      userFound = true;
      break;
    }
  }

  if (!userFound) {
    return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
  }

  const userList = users.map(user => ({
    email: user.email,
    firstName: user.firstname,
    lastName: user.lastname
  }));

  res.status(200).json({ users: userList });
});

app.listen(PORT, () => {
  console.log(`App is running at port : ${PORT}`)
})
module.exports = app;
