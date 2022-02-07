'use strict';

const checkDigit = require('@ollah666/checkdigitcalculator');
const identifiers = require('./data/identifier-list.json');

const END_OF_STRING = -1;

/**
 * Check if the key passes in parameter is the key code. e.g if the parameter is '01' it will return true - but if it is
 * 'gtin' it will return false
 *
 * @param {string} key - e.g '01' or 'gtin'
 * @returns {boolean} true if it is the key code - false otherwise (e.g key name)
 */
const isKeyCode = key => {
  return /^\d+$/.test(key);
};

/**
 * Contains the map of the identifiers that contain a check digit and the place of the check digit in the given
 * identifier
 */
const keyCodeToPosition = {
  '8003': 14, // grai
  '414': 13, // gln
  '00': END_OF_STRING, // sscc
  '8018': END_OF_STRING, // gsrn
  '253': 13, // gdti
  '402': END_OF_STRING, // gsin
  '255': 13, // gcn
  '01': END_OF_STRING, // gtin
};

/**
 * Check if the check digit in the string is valid
 *
 * @param {number} position - the position of the check digit - e.g 14 for a GTIN-14
 * @param {string} value - the string to check
 * @returns {boolean} true if the check digit is valid - false otherwise
 */
const checkTheCheckDigitCalculation = (position, value) => {
  if (position === END_OF_STRING) {
    position = value.length;
  }

  const start = value.substring(0, position - 1);
  const res = checkDigit(start);
  return value.charAt(position - 1) === res.toString();
};

/**
 * Check if the check digit of the identifier has been calculated correctly
 *
 * @param {object} dl - a digital link instance
 * @returns {boolean} true if the check digit is valid - false otherwise
 */
const checkTheCheckDigitCalculationOfDigitalLink = dl => {
  const key = Object.keys(dl.identifier)[0];
  let keyCode = '';

  if (!key)
    // the object hasn't any identifier. By default it isn't valid
    return false;

  if (isKeyCode(key)) {
    keyCode = key;
  } else {
    keyCode = identifiers.find(i => i.ruleName === `${key}-value`).code;
  }

  if (!keyCodeToPosition[keyCode]) return true; // the identifier hasn't any check digit

  return checkTheCheckDigitCalculation(keyCodeToPosition[keyCode], dl.identifier[key]);
};

module.exports = {
  checkTheCheckDigitCalculation,
  checkTheCheckDigitCalculationOfDigitalLink,
  isKeyCode,
};
