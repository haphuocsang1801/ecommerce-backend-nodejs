"use strict"
const _ = require("lodash")

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

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
module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData
}
