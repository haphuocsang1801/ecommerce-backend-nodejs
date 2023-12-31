"use strict"

//lever 0
// const config = {
//   app: {
//     port:3000
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "db"
//   }
// }
//lever 1
const dev = {
  app: {
    port:process.env.DEV_DB_PORT
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME
  }
}
const pro = {
  app: {
    port:3000
  },
  db: {
    host: process.env.PRO_DB_HOST,
    port: process.env.PRO_DB_PORT,
    name: process.env.PRO_DB_NAME
  }
}
const config = {dev, pro}
const env = process.env.NODE_ENV || 'dev'
exports.default = config[env]