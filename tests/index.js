'use strict';

const { expect } = require('chai');
const { DigitalLink, Utils } = require('..');

const DATA = {
  domain: 'https://gs1.evrythng.com',
  identifier: {
    key: '01',
    value: '9780345418913',
  },
  serialQualifier: {
    key: '21',
    value: '58943',
  },
  batchQualifier: {
    key: '10',
    value: '38737643',
  },
  keyQualifiersOrder: ['10', '21'],
  bestBeforeAttribute: {
    key: '15',
    value: '230911',
  },
  customAttribute: {
    key: 'thngId',
    value: 'U5mQKGDpnymBwQwRakyBqeYh',
  },
  url:
    'https://gs1.evrythng.com/01/9780345418913/10/38737643/21/58943?15=230911&thngId=U5mQKGDpnymBwQwRakyBqeYh',
  jsonString:
    '{"domain":"https://gs1.evrythng.com","identifier":{"01":"9780345418913"},"keyQualifiers":{"10":"38737643","21":"58943"},"attributes":{"15":"230911","thngId":"U5mQKGDpnymBwQwRakyBqeYh"},"sortKeyQualifiers":false,"keyQualifiersOrder":["10","21"]}',
  compressedWebUri:
    'https://gs1.evrythng.com/HxHKVAdpQhCTxbrOF_yEFcx_4a2GeAh1mFOZkChg6Z8pgcEMEWpMganmIQ',
};

/**
 * Create a DL using Setters
 *
 * @returns {{DL instance}}
 */
const createUsingSetters = () => {
  const dl = DigitalLink();
  dl.setDomain(DATA.domain);
  dl.setIdentifier(DATA.identifier.key, DATA.identifier.value);
  dl.setKeyQualifier(DATA.batchQualifier.key, DATA.batchQualifier.value);
  dl.setKeyQualifier(DATA.serialQualifier.key, DATA.serialQualifier.value);
  dl.setKeyQualifiersOrder(DATA.keyQualifiersOrder);
  dl.setAttribute(DATA.bestBeforeAttribute.key, DATA.bestBeforeAttribute.value);
  dl.setAttribute(DATA.customAttribute.key, DATA.customAttribute.value);
  return dl;
};

/**
 * Create a DL using Object
 *
 * @returns {{DL instance}}
 */
const createUsingObject = () =>
  DigitalLink({
    domain: DATA.domain,
    identifier: { [DATA.identifier.key]: DATA.identifier.value },
    keyQualifiers: {
      [DATA.batchQualifier.key]: DATA.batchQualifier.value,
      [DATA.serialQualifier.key]: DATA.serialQualifier.value,
    },
    keyQualifiersOrder: DATA.keyQualifiersOrder,
    attributes: {
      [DATA.bestBeforeAttribute.key]: DATA.bestBeforeAttribute.value,
      [DATA.customAttribute.key]: DATA.customAttribute.value,
    },
  });

/**
 * Create a DL using string
 *
 * @returns {{DL instance}}
 */
const createUsingString = () => DigitalLink(DATA.url);

/**
 * Create a DL using Chain
 *
 * @returns {{DL instance}}
 */
const createUsingChain = () =>
  DigitalLink()
    .setDomain(DATA.domain)
    .setIdentifier(DATA.identifier.key, DATA.identifier.value)
    .setKeyQualifier(DATA.batchQualifier.key, DATA.batchQualifier.value)
    .setKeyQualifier(DATA.serialQualifier.key, DATA.serialQualifier.value)
    .setKeyQualifiersOrder(DATA.keyQualifiersOrder)
    .setAttribute(DATA.bestBeforeAttribute.key, DATA.bestBeforeAttribute.value)
    .setAttribute(DATA.customAttribute.key, DATA.customAttribute.value);

describe('Exports', () => {
  it('should export DigitalLink', () => {
    expect(DigitalLink).to.be.a('function');
    expect(() => DigitalLink()).to.not.throw();
  });

  it('should export Utils.Rules', () => {
    expect(Utils.Rules).to.be.an('object');
    expect(Object.keys(Utils.Rules).length).to.equal(31);
  });

  it('should export Utils.testRule', () => {
    expect(Utils.testRule).to.be.a('function');
  });

  it('should export Utils.generateStatsHtml', () => {
    expect(Utils.generateStatsHtml).to.be.a('function');
  });

  it('should export Utils.generateTraceHtml', () => {
    expect(Utils.generateTraceHtml).to.be.a('function');
  });

  it('should export Utils.generateResultsHtml', () => {
    expect(Utils.generateResultsHtml).to.be.a('function');
  });

  it('should export Utils.compressWebUri', () => {
    expect(Utils.compressWebUri).to.be.a('function');
  });

  it('should export Utils.decompressWebUri', () => {
    expect(Utils.decompressWebUri).to.be.a('function');
  });

  it('should export Utils.isCompressedWebUri', () => {
    expect(Utils.isCompressedWebUri).to.be.a('function');
  });
});

describe('DigitalLink', () => {
  describe('Creation', () => {
    it('should create using setters', () => {
      expect(createUsingSetters).to.not.throw();
    });

    it('should create from an options object', () => {
      expect(createUsingObject).to.not.throw();
    });

    it('should create from a valid input URL', () => {
      expect(createUsingString).to.not.throw();
    });

    it('should create using chained setters', () => {
      expect(createUsingChain).to.not.throw();
    });

    it('should create from string - domain + identifier', () => {
      const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913');

      expect(dl.getDomain()).to.equal(DATA.domain);
      expect(dl.getIdentifier()).to.deep.equal({
        [DATA.identifier.key]: DATA.identifier.value,
      });
    });

    it('should create from string - domain + identifier + 1 key qualifier', () => {
      const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913/10/38737643');

      expect(dl.getDomain()).to.equal(DATA.domain);
      expect(dl.getIdentifier()).to.deep.equal({ '01': '9780345418913' });
      expect(dl.getKeyQualifier('10')).to.equal('38737643');
    });

    it('should create from string - domain + identifier + 2 key qualifiers', () => {
      const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913/10/38737643/21/58943');

      expect(dl.getDomain()).to.equal(DATA.domain);
      expect(dl.getIdentifier()).to.deep.equal({ '01': '9780345418913' });
      expect(dl.getKeyQualifier('10')).to.equal('38737643');
      expect(dl.getKeyQualifier('21')).to.equal('58943');
    });

    it('should create from string - domain + identifier + 1 key qualifier + 1 attribute', () => {
      const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913/10/38737643?15=230911');

      expect(dl.getDomain()).to.equal(DATA.domain);
      expect(dl.getIdentifier()).to.deep.equal({ '01': '9780345418913' });
      expect(dl.getKeyQualifier('10')).to.equal('38737643');
      expect(dl.getAttribute('15')).to.equal('230911');
    });

    it('should create from string - domain + identifier + 2 key qualifiers + 2 attributes', () => {
      const dl = DigitalLink(
        'https://gs1.evrythng.com/01/9780345418913/10/38737643/21/58943?15=230911&thngId=U5mQKGDpnymBwQwRakyBqeYh',
      );

      expect(dl.getDomain()).to.equal(DATA.domain);
      expect(dl.getIdentifier()).to.deep.equal({ '01': '9780345418913' });
      expect(dl.getKeyQualifier('10')).to.equal('38737643');
      expect(dl.getKeyQualifier('21')).to.equal('58943');
      expect(dl.getAttribute('15')).to.equal('230911');
      expect(dl.getAttribute('thngId')).to.equal('U5mQKGDpnymBwQwRakyBqeYh');
    });

    it('should create from string - compressed URI', () => {
      const dl = DigitalLink(DATA.compressedWebUri);
      const expected =
        'https://gs1.evrythng.com/01/09780345418913/10/38737643/21/58943?15=230911&thngId=U5mQKGDpnymBwQwRakyBqeYh';

      expect(dl.toWebUriString()).to.equal(expected);
    });

    it('should produce the same regardless of construction method', () => {
      const expected = createUsingSetters().toWebUriString();
      expect(createUsingObject().toWebUriString()).to.equal(expected);
      expect(createUsingString().toWebUriString()).to.equal(expected);
      expect(createUsingSetters().toWebUriString()).to.equal(expected);
      expect(createUsingChain().toWebUriString()).to.equal(expected);
    });

    it('should not allow access to underlying data', () => {
      const dl = DigitalLink(DATA.url);
      expect(dl.model).to.equal(undefined);
    });

    it('should construct with invalid uncompressed input', () => {
      // Including a partially constructed URI
      const partial = 'https://gs1.evrythng.com/01/123';

      expect(() => DigitalLink(partial)).to.not.throw();
      expect(DigitalLink(partial).isValid()).to.equal(false);
    });
  });

  describe('Invalid Creation', () => {
    it('should throw for a missing protocol', () => {
      expect(() => DigitalLink('badurl')).to.throw();
    });

    it('should throw for missing identifier (object)', () => {
      // eslint-disable-next-line require-jsdoc
      const create = () =>
        DigitalLink({
          keyQualifiers: {
            [DATA.batchQualifier.key]: DATA.batchQualifier.value,
            [DATA.serialQualifier.key]: DATA.serialQualifier.value,
          },
        });

      expect(create).to.throw();
    });

    it('should throw for missing identifier (string)', () => {
      expect(() => DigitalLink(DATA.domain)).to.throw();
    });
  });

  describe('Getters', () => {
    it('should return the domain', () => {
      expect(createUsingSetters().getDomain()).to.equal(DATA.domain);
    });

    it('should return the identifier', () => {
      const identifier = createUsingSetters().getIdentifier();
      const [idKey] = Object.keys(identifier);

      expect(idKey).to.equal(DATA.identifier.key);
      expect(identifier[idKey]).to.equal(DATA.identifier.value);
    });

    it('should return one key qualifier', () => {
      const value = createUsingSetters().getKeyQualifier(DATA.batchQualifier.key);

      expect(value).to.equal(DATA.batchQualifier.value);
    });

    it('should return all key qualifiers', () => {
      const value = createUsingSetters().getKeyQualifiers();
      const expected = {
        [DATA.serialQualifier.key]: DATA.serialQualifier.value,
        [DATA.batchQualifier.key]: DATA.batchQualifier.value,
      };

      expect(value).to.deep.equal(expected);
    });

    it('should return one attribute', () => {
      const setterDl = createUsingSetters();

      let value = setterDl.getAttribute(DATA.bestBeforeAttribute.key);
      expect(value).to.equal(DATA.bestBeforeAttribute.value);

      value = setterDl.getAttribute(DATA.customAttribute.key);
      expect(value).to.equal(DATA.customAttribute.value);
    });

    it('should return all attributes', () => {
      const value = createUsingSetters().getAttributes();
      const expected = {
        [DATA.bestBeforeAttribute.key]: DATA.bestBeforeAttribute.value,
        [DATA.customAttribute.key]: DATA.customAttribute.value,
      };

      expect(value).to.deep.equal(expected);
    });
  });

  describe('Setters', () => {
    let dl;

    beforeEach(() => {
      dl = DigitalLink();
    });

    it('should set the domain', () => {
      const input = 'https://gs1.evrythng.com';

      expect(() => dl.setDomain(input)).to.not.throw();
      expect(dl.getDomain()).to.equal(input);
    });

    it('should set the identifier', () => {
      const ai = '01';
      const value = '09780345418913';

      expect(() => dl.setIdentifier(ai, value)).to.not.throw();
      expect(dl.getIdentifier()).to.deep.equal({ [ai]: value });
    });

    it('should set a key qualifier', () => {
      const ai = '21';
      const value = '36527';

      expect(() => dl.setKeyQualifier(ai, value)).to.not.throw();
      expect(dl.getKeyQualifier(ai)).to.equal(value);
    });

    it('should not validate setting the key qualifiers in the wrong order', () => {
      const values = {
        gtin: {
          ai: '01',
          value: '12345678',
        },
        lot: {
          ai: '10',
          value: '211',
        },
        ser: {
          ai: '21',
          value: '2121',
        },
        cpv: {
          ai: '22',
          value: '122113',
        },
      };

      dl.setDomain('https://gs1.evrythng.com');
      dl.setIdentifier(values.gtin.ai, values.gtin.value);
      dl.setKeyQualifier(values.lot.ai, values.lot.value);
      dl.setKeyQualifier(values.cpv.ai, values.cpv.value);
      dl.setKeyQualifier(values.ser.ai, values.ser.value);

      expect(dl.isValid()).to.equal(false);
    });

    it('should set the key identifiers in the right order', () => {
      const values = {
        gtin: {
          ai: '01',
          value: '12345678',
        },
        lot: {
          ai: '10',
          value: '211',
        },
        ser: {
          ai: '21',
          value: '2121',
        },
        cpv: {
          ai: '22',
          value: '122113',
        },
      };

      dl.setDomain('https://gs1.evrythng.com');
      dl.setIdentifier(values.gtin.ai, values.gtin.value);
      dl.setKeyQualifier(values.lot.ai, values.lot.value);
      dl.setKeyQualifier(values.cpv.ai, values.cpv.value);
      dl.setKeyQualifier(values.ser.ai, values.ser.value);
      dl.setSortKeyQualifiers(true);

      expect(dl.isValid()).to.equal(true);
    });

    it('should set an attribute', () => {
      const key = 'thngId';
      const value = 'U5mQKGDpnymBwQwRakyBqeYh';

      expect(() => dl.setAttribute(key, value)).to.not.throw();
      expect(dl.getAttribute(key)).to.equal(value);
    });

    it('should throw for an invalid domain type', () => {
      expect(() => dl.setDomain({ url: 'https://gs1.evrythng.com' })).to.throw();
    });

    it('should throw for an invalid identifier type', () => {
      expect(() => dl.setIdentifier({ '01': '9780345418913' })).to.throw();
    });

    it('should throw for an invalid key qualifier type', () => {
      expect(() => dl.setKeyQualifier({ '21': '36527' })).to.throw();
    });

    it('should throw for an invalid attribute type', () => {
      expect(() => dl.setAttribute({ thngId: 'U5mQKGDpnymBwQwRakyBqeYh' })).to.throw();
    });
  });

  describe('Generation', () => {
    it('should generate the correct URL string', () => {
      expect(createUsingSetters().toWebUriString()).to.equal(DATA.url);
    });

    it('should generate the correct JSON string', () => {
      expect(createUsingSetters().toJsonString()).to.equal(DATA.jsonString);
    });

    it('should generate the correct compressed web URI string', () => {
      expect(createUsingSetters().toCompressedWebUriString()).to.equal(DATA.compressedWebUri);
    });
  });

  describe('Validation', () => {
    it('should validate using the grammar', () => {
      const dl = createUsingSetters();
      expect(dl.isValid()).to.equal(true);
    });

    it('should validate a URL with a custom path using the grammar', () => {
      const dl = DigitalLink('https://example.com/some/other/path/info/01/01234567890128/21/12345');
      expect(dl.isValid()).to.equal(true);
    });

    it('should not validate an URL with a custom path (but with a wrong identifier) using the grammar', () => {
      const dl = DigitalLink('https://example.com/my/custom/path/01/0123456789d/21/12345/10/4512');
      expect(dl.isValid()).to.equal(false);
    });

    it('should transparently validate a valid compressed URI', () => {
      const dl = DigitalLink('https://dlnkd.tn.gg/ARHKVAdpQg');
      expect(dl.isValid()).to.equal(true);
    });

    it('should parse a valid URL trace history', () => {
      const expected = {
        trace: [
          { rule: 'scheme', match: 'https', remainder: '://gs1.evrythng.com/01/9780345418913' },
          { rule: 'reg-name', match: 'gs1.evrythng.com', remainder: '/01/9780345418913' },
          { rule: 'host', match: 'gs1.evrythng.com', remainder: '/01/9780345418913' },
          { rule: 'hostname', match: 'gs1.evrythng.com', remainder: '/01/9780345418913' },
          {
            rule: 'customURIstem',
            match: 'https://gs1.evrythng.com',
            remainder: '/01/9780345418913',
          },
          { rule: 'gtin-code', match: '01', remainder: '/9780345418913' },
          { rule: 'gtin-value', match: '9780345418913', remainder: '' },
          { rule: 'gtin-comp', match: '/01/9780345418913', remainder: '' },
          { rule: 'gtin-path', match: '/01/9780345418913', remainder: '' },
          { rule: 'gs1path', match: '/01/9780345418913', remainder: '' },
          { rule: 'uncompressedGS1webURIPattern', match: '/01/9780345418913', remainder: '' },
          {
            rule: 'uncompressedCustomGS1webURI',
            match: 'https://gs1.evrythng.com/01/9780345418913',
            remainder: '',
          },
        ],
        success: true,
      };

      const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913');
      expect(dl.getValidationTrace()).to.deep.equal(expected);
    });

    it('should parse an invalid URL trace history', () => {
      const expected = {
        trace: [
          { rule: 'scheme', match: 'https', remainder: '://gs1.evrythng.com/01/9780345418913d' },
          { rule: 'reg-name', match: 'gs1.evrythng.com', remainder: '/01/9780345418913d' },
          { rule: 'host', match: 'gs1.evrythng.com', remainder: '/01/9780345418913d' },
          { rule: 'hostname', match: 'gs1.evrythng.com', remainder: '/01/9780345418913d' },
          {
            rule: 'customURIstem',
            match: 'https://gs1.evrythng.com',
            remainder: '/01/9780345418913d',
          },
          { rule: 'gtin-code', match: '01', remainder: '/9780345418913d' },
          { rule: 'gtin-value', match: '9780345418913', remainder: 'd' },
          { rule: 'gtin-comp', match: '/01/9780345418913', remainder: 'd' },
          { rule: 'gtin-path', match: '/01/9780345418913', remainder: 'd' },
          { rule: 'gs1path', match: '/01/9780345418913', remainder: 'd' },
          { rule: 'uncompressedGS1webURIPattern', match: '/01/9780345418913', remainder: 'd' },
          {
            rule: 'uncompressedCustomGS1webURI',
            match: 'https://gs1.evrythng.com/01/9780345418913',
            remainder: 'd',
          },
        ],
        success: false,
      };
      const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913d');
      expect(dl.getValidationTrace()).to.deep.equal(expected);
    });

    describe('Some example test cases', () => {
      it('should allow a GTIN only', () => {
        const dl = DigitalLink('https://example.com/01/01234567/');
        expect(dl.isValid()).to.equal(true);
      });

      it('should allow a GTIN with two key qualifiers', () => {
        const dl = DigitalLink('https://example.com/01/01234567/10/12345/21/4512');
        expect(dl.isValid()).to.equal(true);
      });

      it('should not validate since the key qualifiers are not in the right order', () => {
        const dl = DigitalLink('https://example.com/01/01234567/21/12345/10/4512');
        expect(dl.isValid()).to.equal(false);
      });

      it('Should validate when key qualifiers are not in the right order, but were sorted (Numeric)', () => {
        const dl = DigitalLink('https://example.com/01/01234567/21/12345/10/4512');
        dl.setSortKeyQualifiers(true);
        expect(dl.isValid()).to.equal(true);
      });

      it('Should validate when key qualifiers are not in the right order, but were sorted (Alphanumeric)', () => {
        const dl = DigitalLink('https://example.com/01/01234567/21/12345/10/4512');
        dl.setSortKeyQualifiers(true);
        expect(dl.isValid()).to.equal(true);
      });

      it("should throw an error since there isn't any identifier", () => {
        expect(() => {
          DigitalLink('https://example.com/custom/path/');
        }).to.throw();
      });

      it('should not validate since the key qualifier is not matching the identifier', () => {
        const dl = DigitalLink('https://example.com/00/123456789123456789/10/4512');
        expect(dl.isValid()).to.equal(false);
      });

      it('should not validate since dangerousGoodsParameter (4321) is a boolean is not matching the identifier', () => {
        const dl = DigitalLink('https://example.com/01/12345678/10/4512?4321=2');
        expect(dl.isValid()).to.equal(false);
      });
    });
  });
});

describe('Compression', () => {
  it('should compress a Digital Link URI', () => {
    const input = 'https://dlnkd.tn.gg/gtin/09780345418913/lot/231/ser/345345?15=120820';
    const expected = 'https://dlnkd.tn.gg/HxHKVAdpQgZzjr-hCDKigI';

    expect(Utils.compressWebUri(input)).to.equal(expected);
  });

  it('should decompress a compressed Digital Link URI', () => {
    const input = 'https://dlnkd.tn.gg/HxHKVAdpQgZzjr-hCDKigI';
    const expected = 'https://dlnkd.tn.gg/01/09780345418913/10/231/21/345345?15=120820';

    expect(Utils.decompressWebUri(input)).to.equal(expected);
  });

  it('should compress a Digital Link URI with a custom path', () => {
    const input = 'https://example.com/some/other/path/info/01/09780345418913/21/12345';
    const expected = 'https://example.com/some/other/path/info/DBHKVAdpQgowOQ';
    expect(Utils.compressWebUri(input)).to.equal(expected);
  });

  it('should decompress a compressed Digital Link URI with a custom path', () => {
    const input = 'https://example.com/some/other/path/info/DBHKVAdpQgowOQ';
    const expected = 'https://example.com/some/other/path/info/01/09780345418913/21/12345';
    expect(Utils.decompressWebUri(input)).to.equal(expected);
  });

  it('should decompress a compressed Digital Link URI using short AI names', () => {
    const input = 'https://dlnkd.tn.gg/HxHKVAdpQgZzjr-hCDKigI';
    const expected = 'https://dlnkd.tn.gg/gtin/09780345418913/lot/231/ser/345345?15=120820';

    expect(Utils.decompressWebUri(input, true)).to.equal(expected);
  });

  it('should detect a compressed Digital Link URI', () => {
    const input = 'https://dlnkd.tn.gg/HxHKVAdpQgZzjr-hCDKigI';

    expect(Utils.isCompressedWebUri(input)).to.equal(true);
  });

  it('should detect an uncompressed Digital Link URI', () => {
    const input = 'https://dlnkd.tn.gg/gtin/09780345418913/lot/231/ser/345345?15=120820';

    expect(Utils.isCompressedWebUri(input)).to.equal(false);
  });

  it('should use optimisations and compress other key-value pairs by default', () => {
    const input = 'https://dlnkd.tn.gg/01/9780345418913/21/43786?foo=bar';
    const expected = 'https://dlnkd.tn.gg/DBHKVAdpQgqrCvBv0UMG21W';

    expect(Utils.compressWebUri(input)).to.equal(expected);
  });

  it('should allow not using optimisations and compressing other key-value pairs', () => {
    const input = 'https://dlnkd.tn.gg/01/9780345418913/21/43786?foo=bar';
    const expected = 'https://dlnkd.tn.gg/ARHKVAdpQkIKqwo?foo=bar';
    const useOptimisations = false;
    const compressOtherKeyValuePairs = false;
    const result = Utils.compressWebUri(input, useOptimisations, compressOtherKeyValuePairs);

    expect(result).to.equal(expected);
  });
});

describe('Utils', () => {
  it('should validate some rules', () => {
    expect(Utils.testRule(Utils.Rules.gtin, '9780345418913')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.ser, '58943')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.cpv, '489327')).to.equal(true);
  });

  it('should validate some custom parameters and not validate some other', () => {
    expect(Utils.testRule(Utils.Rules.extensionParameter, 'test=true')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.extensionParameter, 'MyParameter=1')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.extensionParameter, '0105=abc')).to.equal(false);
    expect(Utils.testRule(Utils.Rules.extensionParameter, '0105:=1')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.extensionParameter, 'a1=0')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.extensionParameter, 'a=1')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.extensionParameter, '789789a789789=abc')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.extensionParameter, '789789789789a=abc')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.extensionParameter, 'A789789789789)=abc')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.extensionParameter, '789789789789=abc')).to.equal(false);
  });

  it('should not validate when rules are not met', () => {
    expect(Utils.testRule(Utils.Rules.gtin, '9780345418913d')).to.equal(false);
    expect(Utils.testRule(Utils.Rules.ser, '{}')).to.equal(false);
  });

  it('should throw for an invalid rule name', () => {
    expect(() => Utils.testRule('foo', '83479347')).to.throw();
  });

  it('should generate some stats HTML', () => {
    const input = 'https://data.gs1.org/01/47474747474747d';
    const sample = '<table class="apg-stats">';

    expect(Utils.generateStatsHtml(input)).to.include(sample);
  });

  it('should generate some trace HTML', () => {
    const input = 'https://data.gs1.org/01/47474747474747d';
    const sample = '<table class="apg-trace">';

    expect(Utils.generateTraceHtml(input)).to.include(sample);
  });

  it('should generate some results HTML', () => {
    const input = 'https://id.gs1.org/01/47474747474747d';
    const sample = '<table class="apg-state">';
    const res = Utils.generateResultsHtml(input);
    expect(res).to.include(sample);
  });

  it('Should find the correct identifier key index', () => {
    const segments = ['some', '01', 'path', '01', '12345678', '21', '4545646'];
    expect(Utils.getIdentifierCodeIndex(segments)).to.equal(3);
  });
});

describe('Grammar', () => {
  it('should recognize https and not http', () => {
    const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913');
    expect(dl.getValidationTrace().trace[0].match).to.equal('https');
  });

  // I created this test to check if a single parameter can be recognized
  // Warning : if you move to another version, you might need to update this test (if the parameter doesn't exist anymore or its code change..)
  it('should recognize notBeforeDelDateParameter', () => {
    const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913?4324=1234567891');
    let containTheParameter = false;
    dl.getValidationTrace().trace.forEach(e => {
      if (e.rule === 'notBeforeDelDateParameter') containTheParameter = true;
    });
    expect(containTheParameter).to.equal(true);
  });

  // I created this test to check if a boolean parameter can be recognized
  // Warning : if you move to another version, you might need to update this test (if the parameter doesn't exist anymore or its code change..)
  it('should recognize dangerousGoodsParameter', () => {
    const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913?4321=1');
    let containTheParameter = false;
    dl.getValidationTrace().trace.forEach(e => {
      if (e.rule === 'dangerousGoodsParameter') containTheParameter = true;
    });
    expect(containTheParameter).to.equal(true);
  });
});
