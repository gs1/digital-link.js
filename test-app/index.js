import { app, h } from 'hyperapp';

const { DigitalLink } = require('digital-link.js');

const state = {
  url: '',
  jsonString: '',
  isValid: false,
  trace: [],
};

const actions = {
  setUrl: url => state => ({ url }),
  setJsonString: jsonString => state => ({ jsonString }),
  setIsValid: isValid => state => ({ isValid }),
  setTrace: trace => state => ({ trace }),
  validateUrl: el => (state, actions) => {
    actions.setUrl(el.target.value);

    try {
      const dl = DigitalLink(el.target.value);
      actions.setIsValid(dl.isValid());
      actions.setJsonString(dl.toJsonString());
      actions.setTrace(dl.getValidationTrace().trace);
    } catch (e) {
      console.log(e);
      actions.setIsValid(false);
      actions.setJsonString('');
      actions.setTrace([]);
    }
  },
};

const Paragraph = (props, children) => <div class="paragraph">{children}</div>;

const TraceView = ({ trace }) => (trace.length > 0 && 
  <table class="trace-wrapper">
    <tr><th>Step</th><th>Rule</th><th>Matched</th><th>Remainder</th></tr>
    {trace.map((item, i) => (
      <tr class="trace-item">
        <td>{i + 1}</td><td>{item.rule}</td><td>{item.match}</td><td>{item.remainder}</td>
      </tr>
    ))}
  </table>);

const view = (state, actions) => (
  <div class="col-centered">
    <h1 class="title">Example Digital Link Verifier</h1>
    <Paragraph>Enter your GS1 Digital Link below to see if it is valid.</Paragraph>
    <input type="text" class="input-url" value={state.url} oninput={actions.validateUrl}
      style={{ borderBottom: `solid 4px ${state.isValid === true ? 'limegreen' : 'red'}` }}/>
    <Paragraph>
      Powered by the <a href="https://github.com/evrythng/digital-link.js" target="_blank">
        digital-link.js</a> SDK.
    </Paragraph>
    <TraceView trace={state.trace}/>
    <textarea class="state-view" disabled>{state.jsonString}</textarea>
  </div>
);

app(state, actions, view, document.body);
