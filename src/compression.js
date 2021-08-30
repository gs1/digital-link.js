'use strict';

const GS1DigitalLinkToolkit = require('../lib/GS1DigitalLinkCompressionPrototype/GS1DigitalLinkToolkit');

const { getIdentifierCodeIndex } = require('./util');

const toolkit = new GS1DigitalLinkToolkit();

/**
 * Get the stem of a URI.
 *
 * @param {string} uri - The URI.
 * @returns {string} The URI stem.
 */
const getUriStem = uri =>
  uri
    .split('/')
    .slice(0, 3)
    .join('/');

/**
 * Use GS1DigitalLinkToolkit to compress a URI string.
 *
 * @param {string} uri - The URI to compress.
 * @param {boolean} [useOptimisations] - Set to false to disable optimisations.
 * @param {boolean} [compressOtherKeyValuePairs] - Set to false to disable compression of other
 *                                                 key-value pairs.
 * @returns {string} The equivalent compressed URI.
 */
const compressWebUri = (uri, useOptimisations = true, compressOtherKeyValuePairs = true) => {
  const uncompressedPrimary = false;
  const useShortText = false;

  // There is a problem with the toolkit
  // When you ask to compress a Digital Link that has a custom path (ex : https://example.com/custom/path/01/12345678)
  // The compressed link lose the custom path
  // So we need to add it again

  const compressedWithoutTheCustomPath = toolkit.compressGS1DigitalLink(
    uri,
    useShortText, // Not used
    getUriStem(uri),
    uncompressedPrimary, // Not used
    useOptimisations,
    compressOtherKeyValuePairs,
  );

  // ex: 'https://example.com'
  const domainWithoutCustomPath = uri
    .split('/')
    .slice(0, 3)
    .join('/');

  // ex: '/some/other/path/info/01/01234567890128/21/12345'
  const uriWithoutDomain = uri.substring(domainWithoutCustomPath.length);

  const segments = (uriWithoutDomain.includes('?')
    ? uriWithoutDomain.substring(0, uriWithoutDomain.indexOf('?'))
    : uriWithoutDomain
  )
    .split('/')
    .filter(p => p.length);

  // let's find the identifier to know where the custom path stops
  const endPathSegments = [];
  const indexIdentifier = getIdentifierCodeIndex(segments);

  if (indexIdentifier === -1) {
    throw new Error('Must contain at least the identifier');
  }

  // I retrieve all the optional path segments. For example, for the string
  // https://example.com/some/other/path/info/01/01234567890128/21/12345, it would be  ['some','other','path','info']
  for (let i = 0; i < indexIdentifier; i += 1) {
    endPathSegments.push(segments[i]);
  }

  let domain = domainWithoutCustomPath;

  // If the domain has a custom path, I add it
  if (endPathSegments.length) {
    domain = `${domain}/${endPathSegments.join('/')}`;
  }

  // I add the path segments to the compressed URI
  return compressedWithoutTheCustomPath.replace(domainWithoutCustomPath, domain);
};

/**
 * Use GS1DigitalLinkToolkit to decompress a URI string.
 *
 * @param {string} uri - The URI to decompress.
 * @param {boolean} [useShortText] - Set to true to use short AI names, eg. 'gtin' instead of '01'.
 * @returns {string} The equivalent decompressed URI.
 */
const decompressWebUri = (uri, useShortText = false) => {
  const decompressedWithoutTheCustomPath = toolkit.decompressGS1DigitalLink(
    uri,
    useShortText,
    getUriStem(uri),
  );

  // ex: 'https://example.com'
  const domainWithoutCustomPath = uri
    .split('/')
    .slice(0, 3)
    .join('/');

  // ex: '/some/other/path/info/01/01234567890128/21/12345'
  const uriWithoutDomain = uri.substring(domainWithoutCustomPath.length);

  const segments = (uriWithoutDomain.includes('?')
    ? uriWithoutDomain.substring(0, uriWithoutDomain.indexOf('?'))
    : uriWithoutDomain
  )
    .split('/')
    .filter(p => p.length);

  // I remove the compressed string to have only the custom path info
  // https://example.com/some/other/path/info/DBHKVAdpQgowOQ it would be  ['some','other','path','info']
  segments.pop();

  let domain = domainWithoutCustomPath;

  // If the domain has a custom path, I add it
  if (segments.length) {
    domain = `${domain}/${segments.join('/')}`;
  }

  return decompressedWithoutTheCustomPath.replace(domainWithoutCustomPath, domain);
};

/**
 * Detect whether a string is a compressed URI or not.
 * The GS1DigitalLinkToolkit returns one of three strings based on if the input looks compressed:
 *   "uncompressed GS1 Digital Link"
 *   "partially compressed GS1 Digital Link"
 *   "fully compressed GS1 Digital Link"
 *
 * Note: this function includes the result's validity, meaning only valid compressed URIs,
 * are supported. Since we cannot compress invalid URIs, this is acceptable.
 *
 * @param {string} uri - The URI.
 * @returns {boolean} true if the URI is valid and looks compressed, false otherwise.
 */
const isCompressedWebUri = uri => {
  const data = toolkit.analyseURI(uri);
  const looksCompressed = ['fully', 'partially'].some(p => data.detected.includes(p));
  if (!looksCompressed) {
    return false;
  }

  try {
    decompressWebUri(uri);
    return true;
  } catch (e) {
    // An error is thrown if the decompress result is not a valid URI.
    return false;
  }
};

module.exports = {
  compressWebUri,
  decompressWebUri,
  isCompressedWebUri,
};
