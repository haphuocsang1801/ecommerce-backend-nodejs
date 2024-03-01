"use strict";

const mongoose = require("mongoose");
const {
  default: {
    db: { host, name, port },
  },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnection } = require("../helpers/check.connect");
class Database {
  constructor() {
    this._connect();
  }
	design
  _connect(type = "mongodb") {	
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then(() => {
        console.log("Connected to MongoDB", countConnection());
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
