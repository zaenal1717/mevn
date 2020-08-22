const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// get db
const db = require("./app/model");
const Role = db.role;

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
    initial();
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse content-type application/json
app.use(bodyParser.json());

// parse content-type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// simple route
app.get("/", (req, res) => {
  req.json({ message: "Welcome to my application" });
});

require("./app/routes/BlogRoutes")(app);
require("./app/routes/UserRoutes")(app);
require("./app/routes/AuthRoutes")(app);
require("./app/routes/CommentRoutes")(app);

// set PORT, to listen request
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
