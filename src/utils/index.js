"use strict"
const _ = require("lodash")
const {Types} = require('mongoose')
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}
const convertToObjectIdMongodb = id => new Types.ObjectId(id);
/**
 *
 * @param {* ['name', 'email', 'age']}
 * @returns { 'name': 1, 'email': 1, 'age': 1 }
 */
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}
/**
 *
 * @param {* ['name', 'email', 'age']}
 * @returns { 'name': 0, 'email': 0, 'age': 0 }
 */
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object")
      removeUndefinedObject(obj[key])
    else if (obj[key] === null) delete obj[key]
  })
  return obj
}
/*
 const a = {
    c: { d: 1 }
  }
 db. collection.updateOne({ "c.d": 1 })
 */
const updatedNestedObjectParser = (obj) => {
  const final = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updatedNestedObjectParser(obj[key])
      Object.keys(response).forEach((a) => {
        final[`${key}.${a}`] = response[a]
      })
    } else {
      final[key] = obj[key]
    }
  })
  return final
}


module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updatedNestedObjectParser,
  convertToObjectIdMongodb
}
