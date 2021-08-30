'use strict';

const apglib = require('apg-lib');
const { grammarObject: GrammarObject } = require('../lib/grammarObject');

const GRAMMAR = new GrammarObject();

/**
 * All the possible identifiers
 */
const identifiersCodes = [
  'gtin-code',
  'itip-code',
  'gmn-code',
  'cpid-code',
  'gln-code',
  'partyGln-code',
  'gsrnp-code',
  'gsrn-code',
  'gcn-code',
  'sscc-code',
  'gdti-code',
  'ginc-code',
  'gsin-code',
  'grai-code',
  'giai-code',
];

/**
 * Add query param string pairs to the string result so far.
 *
 * @param {string} result - The DigitalLink string equivalent so far.
 * @param {object} attributes - Object of attributes, either GS1 or custom.
 * @returns {string} Reduced string containing the new attribute pairs.
 */
const addQueryParams = (result, attributes) =>
  Object.keys(attributes).reduce((res, key) => {
    return res.concat(`${res.endsWith('?') ? '' : '&'}${key}=${attributes[key]}`);
  }, result);

/**
 * Get the top-level parser rule for the input string.
 *
 * @param {string} str - The input string.
 * @returns {string} Either canonicalGS1webURI or customGS1webURI depending on format.
 */
const getStartRule = str =>
  str.includes('id.gs1.org') ? 'referenceGS1webURI' : 'uncompressedCustomGS1webURI';

/**
 * Create an initialise a parser object, used for multiple applications.
 *
 * @returns {object} Parser object.
 */
const createParser = () => {
  /* eslint-disable new-cap */
  const parser = new apglib.parser();
  parser.stats = new apglib.stats();
  parser.trace = new apglib.trace();
  /* eslint-enable new-cap */
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
 * Returns the index of the identifier code in the segment list passed as a parameter
 * If the url is https://example.com/some/01/other/path/info/01/01234567890128/21/12345?example=true
 * segment will be [some,01,other,path,info,01,01234567890128,21,12345]
 * And it will return 5. (the second '01' is the identifier code)
 *
 * @param {Array<string>} segments - The list of the url path element
 * @returns {int} the position of the indentifier in the array (-1 if it there is not any identifier).
 */
const getIdentifierCodeIndex = segments => {
  // I'm going through the array to find the identifier
  // I'm starting the loop at the end of the array because if I have this link for example :
  // https://example.com/some/01/other/path/info/01/01234567890128/21/12345
  // The identifier should be the last 01, and not the first one
  for (let i = segments.length - 1; i >= 1; i -= 2) {
    const code = segments[i - 1];
    let isIdentifier = false;

    for (let j = 0; j < identifiersCodes.length; j += 1) {
      if (validateRule(identifiersCodes[j], code)) {
        isIdentifier = true;
        break;
      }
    }

    if (isIdentifier) {
      return i - 1;
    }
  }

  return -1;
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
  /* eslint-disable valid-typeof */
  if (!dl[key] || typeof dl[key] !== type) {
    throw new Error(`${key} must be ${type}`);
  }
  /* eslint-enable valid-typeof */
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
const getTrace = inputStr => {
  const parser = createParser();

  const result = parser.parse(
    GRAMMAR,
    getStartRule(inputStr),
    apglib.utils.stringToChars(inputStr),
    [],
  );
  const traceHtml = parser.trace
    .toHtmlPage('ascii', 'Parsing details:')
    .replace('display mode: ASCII', '');
  const rows = traceHtml
    .substring(traceHtml.indexOf('<table '), traceHtml.indexOf('</table>'))
    .split('<tr>')
    .filter(item => item.includes('&uarr;M'));
  const trace = rows
    .filter(row => row.includes('apg-match'))
    .map(row => {
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
const generateStatsHtml = inputStr => {
  const parser = createParser();
  parser.parse(GRAMMAR, getStartRule(inputStr), apglib.utils.stringToChars(inputStr), []);

  return (
    parser.stats.toHtml('ops', 'ops-only stats') +
    parser.stats.toHtml('index', 'rules ordered by index') +
    parser.stats.toHtml('alpha', 'rules ordered alphabetically') +
    parser.stats.toHtml('hits', 'rules ordered by hit count')
  );
};

/**
 * Generate the trace HTML fragment provided by apglib.
 *
 * @param {string} inputStr - The input URL to generate parser trace for.
 * @returns {string} HTML string representing the trace steps of the validation.
 */
const generateTraceHtml = inputStr => {
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
const generateResultsHtml = inputStr => {
  const parser = createParser();
  const startRule = getStartRule(inputStr);
  const result = parser.parse(GRAMMAR, startRule, apglib.utils.stringToChars(inputStr), []);
  return apglib.utils.parserResultToHtml(result);
};

/**
 * if the domain has a custom path (ex : https://example.com/path/) it returns the domain without the custom path
 * (ex : https://example.com/)
 * Otherwise, it returns the parameter
 *
 * @param {string} webUriString - The Web URI string (you can get it with dl.toWebUriString())
 * @param {string} domain - The domain of the Digital Link (ex : https://example.com/with/custom/path/ or
 * https://example.com/)
 */
const removeCustomPath = (webUriString, domain) => {
  // I remove 'https://' or 'http://'
  const [, domainWithoutProtocol] = domain.split('//');

  const splitDomain = domainWithoutProtocol.split('/');

  if (splitDomain.length > 1) {
    // It has a custom path
    splitDomain.shift(); // [ 'my', 'custom', 'path' ]
    const customPath = `/${splitDomain.join('/')}`; // /my/custom/path
    return webUriString.replace(customPath, '');
  }

  // It doesn't have a custom path
  return webUriString;
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
  getIdentifierCodeIndex,
  removeCustomPath,
};
