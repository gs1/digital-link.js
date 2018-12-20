const apglib = require('apg-lib');
const { grammarObject } = require('./grammar');

const GRAMMAR = new grammarObject();

/**
 * Add query param string pairs to the string result so far.
 *
 * @param {string} result - The DigitalLink string equivalent so far.
 * @param {object} attributes - Object of attributes, either GS1 or custom.
 * @returns {string} Reduced string containing the new attribute pairs.
 */
const addQueryParams = (result, attributes) => Object.keys(attributes).reduce((res, key) => {
  return res.concat(`${(res.endsWith('?') ? '' : '&')}${key}=${attributes[key]}`);
}, result);

/**
 * Get the top-level parser rule for the input string.
 *
 * @param {string} str - The input string.
 * @returns {string} Either canonicalGS1webURI or customGS1webURI depending on format.
 */
const getStartRule = str => str.includes('id.gs1.org') ? 'canonicalGS1webURI' : 'customGS1webURI';

/**
 * Create an initialise a parser object, used for multiple applications.
 *
 * @returns {object} Parser object.
 */
const createParser = () => {
  const parser = new apglib.parser();
  parser.stats = new apglib.stats();
  parser.trace = new apglib.trace();
  return parser;
};

/**
 * Run the apglib parser over a given string according to a given grammar rule.
 *
 * @param {string} rule - The rule name from the grammar.
 * @param {string} inputStr - The DigitalLink as a string.
 * @returns {boolean} true if the parser returns 'success', false otherwise.
 */
const validateRule = (rule, inputStr) => {
  const result = createParser().parse(GRAMMAR, rule, apglib.utils.stringToChars(inputStr), []);
  return result.success;
};

/**
 * Run the apglib parser over the Digital Link URL string.
 *
 * @param {string} inputStr - The DigitalLink as a string.
 * @returns {boolean} true if the parser returns 'success', false otherwise.
 */
const validateUrl = inputStr => validateRule(getStartRule(inputStr), inputStr);

/**
 * Throw an error if key and value are not strings.
 *
 * @param {string} key - The key to check.
 * @param {string} value - The value to check.
 */
const assertStringPair = (key, value) => {
  if (typeof key !== 'string' || typeof value !== 'string') {
    throw new Error('key and value must be strings');
  }
};

/**
 * Throw an error if object property is not of a certain type.
 *
 * @param {object} dl - The DigitalLink.
 * @param {string} key - The key to check.
 * @param {string} type - The type to check key against.
 */
const assertPropertyType = (dl, key, type) => {
  if (!dl[key] || typeof dl[key] !== type) {
    throw new Error(`${key} must be ${type}`);
  }
};

/**
 * Type check and assign a key-value pair to the specified object.
 *
 * @param {object} dl - The DigitalLink.
 * @param {string} prop - Name of the DigitalLink property to modify.
 * @param {string} key - The key to assign.
 * @param {string} value - The value to assign to key.
 */
const assignStringPair = (dl, prop, key, value) => {
  assertStringPair(key, value);
  dl[prop][key] = value;
};

/**
 * Extract text between two markers using a regex.
 *
 * @param {string} str - String to search.
 * @param {string} start - String immediately before the output.
 * @param {string} end - String immediately after the output.
 * @returns {string} String contained between start and end.
 */
const between = (str, start, end) => {
  const matches = str.match(new RegExp(`${start}(.*?)(?=${end})`));
  return matches ? matches[1] : '';
};

/**
 * Get a validation trace showing which parts of the input matched which rules.
 * If the last item has a remainder, that is the part that didn't match.
 *
 * @param {string} inputStr - The input string.
 * @returns {object[]} Array of objects describing the validation trace.
 */
const getTrace = (inputStr) => {
  const parser = createParser();

  const result = parser.parse(GRAMMAR, getStartRule(inputStr), apglib.utils.stringToChars(inputStr), []);
  const traceHtml = parser.trace.toHtmlPage('ascii', 'Parsing details:')
    .replace('display mode: ASCII', '');
  const rows = traceHtml.substring(traceHtml.indexOf('<table '), traceHtml.indexOf('</table>'))
    .split('<tr>')
    .filter(item => item.includes('&uarr;M'));
  const trace = rows.filter(row => row.includes('apg-match'))
    .map((row) => {
      const rule = row.match(/\((.*?)(?=\))/)[1];
      const sample = row.substring(row.indexOf(')'));
      const match = between(sample, 'match">', '<');
      const remainder = between(sample, 'remainder">', '<');
      return { rule, match, remainder };
    })
    .filter(item => item.match.length > 1);
  return { trace, success: result.success };
};

/**
 * Generate the stats HTML fragment provided by apglib.
 *
 * @param {string} inputStr - The input URL to generate parser stats for.
 * @returns {string} HTML string representing the stats of the validation.
 */
const generateStatsHtml = (inputStr) => {
  const parser = createParser();
  parser.parse(GRAMMAR, getStartRule(inputStr), apglib.utils.stringToChars(inputStr), []);

  return parser.stats.toHtml('ops', 'ops-only stats')
   + parser.stats.toHtml('index', 'rules ordered by index')
   + parser.stats.toHtml('alpha', 'rules ordered alphabetically')
   + parser.stats.toHtml('hits', 'rules ordered by hit count');
};

/**
 * Generate the trace HTML fragment provided by apglib.
 *
 * @param {string} inputStr - The input URL to generate parser trace for.
 * @returns {string} HTML string representing the trace steps of the validation.
 */
const generateTraceHtml = (inputStr) => {
  const parser = createParser();
  parser.parse(GRAMMAR, getStartRule(inputStr), apglib.utils.stringToChars(inputStr), []);
  return parser.trace.toHtmlPage('ascii', 'Parsing details:');
};

/**
 * Generate the complete HTML fragment provided by apglib for parsing results.
 *
 * @param {string} inputStr - The input URL to generate parser results for.
 * @returns {string} HTML string representing the results of the validation.
 */
const generateResultsHtml = (inputStr) => {
  const parser = createParser();
  const startRule = getStartRule(inputStr);
  const result = parser.parse(GRAMMAR, startRule, apglib.utils.stringToChars(inputStr), []);
  return apglib.utils.parserResultToHtml(result);
};

module.exports = {
  addQueryParams,
  assertPropertyType,
  assertStringPair,
  assignStringPair,
  validateUrl,
  validateRule,
  getTrace,
  generateStatsHtml,
  generateTraceHtml,
  generateResultsHtml,
};
