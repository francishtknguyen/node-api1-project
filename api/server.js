// BUILD YOUR SERVER HERE
const express = require("express");
const Users = require("./users/model");

const server = express();

server.use(express.json());

// GET

server.get("/api/users", (req, res) => {
  Users.find()
    .then((user) => res.json(user))
    .catch((err) => {
      res.status(500).json({
        message: "The users information could not be retrieved",
      });
    });
});

// GET by ID

server.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({
        message: "The user with the specified ID does not exist",
      });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({
      message: "The users information could not be retrieved",
    });
  }
});

// POST

server.post("/api/users", async (req, res) => {
  try {
    const postedInfo = req.body;
    if (!postedInfo.name || !postedInfo.bio) {
      res.status(404).json({
        message: "Please provide name and bio for the user",
      });
    } else {
      const newUser = await Users.insert(postedInfo);
      res.status(201).json(newUser);
    }
  } catch (err) {
    res.status(500).json({
      message: "There was an error while saving the user to the database",
    });
  }
});

// PUT

server.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name || !bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
  }
  try {
    const updatedUser = await Users.update(id, { name, bio });
    if (!updatedUser) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    } else {
      res.json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({
      message: "The user information could not be modified",
    });
  }
});

// DELETE

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  Users.remove(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      } else {
        res.json(deletedUser);
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "The user could not be removed",
      });
    });
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
