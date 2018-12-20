const { expect } = require('chai');
const { DigitalLink, Utils } = require('../');

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
  bestBeforeAttribute: {
    key: '15',
    value: '230911',
  },
  customAttribute: {
    key: 'thngId',
    value: 'U5mQKGDpnymBwQwRakyBqeYh',
  },
  url: 'https://gs1.evrythng.com/01/9780345418913/10/38737643/21/58943?15=230911&thngId=U5mQKGDpnymBwQwRakyBqeYh',
  jsonString: '{"domain":"https://gs1.evrythng.com","identifier":{"01":"9780345418913"},"keyQualifiers":{"10":"38737643","21":"58943"},"attributes":{"15":"230911","thngId":"U5mQKGDpnymBwQwRakyBqeYh"}}',
};

const createUsingSetters = () => {
  const dl = DigitalLink();
  dl.setDomain(DATA.domain);
  dl.setIdentifier(DATA.identifier.key, DATA.identifier.value);
  dl.setKeyQualifier(DATA.serialQualifier.key, DATA.serialQualifier.value);
  dl.setKeyQualifier(DATA.batchQualifier.key, DATA.batchQualifier.value);
  dl.setAttribute(DATA.bestBeforeAttribute.key, DATA.bestBeforeAttribute.value);
  dl.setAttribute(DATA.customAttribute.key, DATA.customAttribute.value);
  return dl;
};

const createUsingObject = () => DigitalLink({
  domain: DATA.domain,
  identifier: { [DATA.identifier.key]: DATA.identifier.value },
  keyQualifiers: {
    [DATA.batchQualifier.key]: DATA.batchQualifier.value,
    [DATA.serialQualifier.key]: DATA.serialQualifier.value,
  },
  attributes: {
    [DATA.bestBeforeAttribute.key]: DATA.bestBeforeAttribute.value,
    [DATA.customAttribute.key]: DATA.customAttribute.value,
  },
});

const createUsingString = () => DigitalLink(DATA.url);

const createUsingChain = () => DigitalLink()
  .setDomain(DATA.domain)
  .setIdentifier(DATA.identifier.key, DATA.identifier.value)
  .setKeyQualifier(DATA.serialQualifier.key, DATA.serialQualifier.value)
  .setKeyQualifier(DATA.batchQualifier.key, DATA.batchQualifier.value)
  .setAttribute(DATA.bestBeforeAttribute.key, DATA.bestBeforeAttribute.value)
  .setAttribute(DATA.customAttribute.key, DATA.customAttribute.value);

describe('Exports', () => {
  it('should export a creation function', () => {
    expect(DigitalLink).to.be.a('function');
    expect(() => DigitalLink()).to.not.throw();
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

  it('should export Utils.Rules', () => {
    expect(Utils.Rules).to.be.an('object');
    expect(Object.keys(Utils.Rules).length).to.equal(29);
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
      const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913/10/38737643/21/58943?15=230911&thngId=U5mQKGDpnymBwQwRakyBqeYh');

      expect(dl.getDomain()).to.equal(DATA.domain);
      expect(dl.getIdentifier()).to.deep.equal({ '01': '9780345418913' });
      expect(dl.getKeyQualifier('10')).to.equal('38737643');
      expect(dl.getKeyQualifier('21')).to.equal('58943');
      expect(dl.getAttribute('15')).to.equal('230911');
      expect(dl.getAttribute('thngId')).to.equal('U5mQKGDpnymBwQwRakyBqeYh');
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
  });

  describe('Invalid Creation', () => {
    it('should throw for a missing protocol', () => {
      expect(() => DigitalLink('badurl')).to.throw();
    });

    it('should throw for missing identifier (object)', () => {
      const create = () => DigitalLink({
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

  describe('Generation', () => {
    it('should generate the correct URL string', () => {
      expect(createUsingSetters().toWebUriString()).to.equal(DATA.url);
    });

    it('should generate the correct JSON string', () => {
      expect(createUsingSetters().toJsonString()).to.equal(DATA.jsonString);
    });
  });

  describe('Validation', () => {
    it('should validate using the grammar', () => {
      expect(createUsingSetters().isValid()).to.equal(true);
    });

    it('should parse a valid URL trace history', () => {
      const expected = {
        trace: [
          { rule: 'scheme', match: 'https', remainder: '://gs1.evrythng.com/01/9780345418913' },
          { rule: 'reg-name', match: 'gs1.evrythng.com', remainder: '/01/9780345418913' },
          { rule: 'host', match: 'gs1.evrythng.com', remainder: '/01/9780345418913' },
          { rule: 'hostname', match: 'gs1.evrythng.com', remainder: '/01/9780345418913' },
          { rule: 'customURIstem', match: 'https://gs1.evrythng.com', remainder: '/01/9780345418913' },
          { rule: 'gtin-code', match: '01', remainder: '/9780345418913' },
          { rule: 'gtin-value', match: '9780345418913', remainder: '' },
          { rule: 'gtin-comp', match: '/01/9780345418913', remainder: '' },
          { rule: 'gtin-path', match: '/01/9780345418913', remainder: '' },
          { rule: 'gs1path', match: '/01/9780345418913', remainder: '' },
          { rule: 'gs1uriPattern', match: '/01/9780345418913', remainder: '' },
          { rule: 'customGS1webURI', match: 'https://gs1.evrythng.com/01/9780345418913', remainder: '' },
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
          { rule: 'customURIstem', match: 'https://gs1.evrythng.com', remainder: '/01/9780345418913d' },
          { rule: 'gtin-code', match: '01', remainder: '/9780345418913d' },
          { rule: 'gtin-value', match: '9780345418913', remainder: 'd' },
          { rule: 'gtin-comp', match: '/01/9780345418913', remainder: 'd' },
          { rule: 'gtin-path', match: '/01/9780345418913', remainder: 'd' },
          { rule: 'gs1path', match: '/01/9780345418913', remainder: 'd' },
          { rule: 'gs1uriPattern', match: '/01/9780345418913', remainder: 'd' },
          { rule: 'customGS1webURI', match: 'https://gs1.evrythng.com/01/9780345418913', remainder: 'd' },
        ],
        success: false,
      };

      const dl = DigitalLink('https://gs1.evrythng.com/01/9780345418913d');
      expect(dl.getValidationTrace()).to.deep.equal(expected);
    });
  });
});

describe('Utils', () => {
  it('should validate some rules', () => {
    expect(Utils.testRule(Utils.Rules.gtin, '9780345418913')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.ser, '58943')).to.equal(true);
    expect(Utils.testRule(Utils.Rules.cpv, '489327')).to.equal(true);
  });

  it('should not validate when rules are not met', () => {
    expect(Utils.testRule(Utils.Rules.gtin, '9780345418913d')).to.equal(false);
    expect(Utils.testRule(Utils.Rules.ser, '{}')).to.equal(false);
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
    const input = 'https://data.gs1.org/01/47474747474747d';
    const sample = '<table class="apg-state">';

    expect(Utils.generateResultsHtml(input)).to.include(sample);
  });
});
