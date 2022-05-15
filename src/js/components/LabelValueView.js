import { html, css, LitElement } from 'lit';

export class LabelValueView extends LitElement {
  static get styles() {
    return css`
      .label-value-con {
        max-width: 300px;
        min-width: 200px;
        margin: 5px 10px;
      }

      .label {
        padding: 2px;
        font-size: medium;
        font-weight: 500;
        font-family: Arial, Helvetica, sans-serif;
        float: left;
      }

      .value {
        padding: 2px;
        font-size: large;
        font-weight: 700;
        font-family: Arial, Helvetica, sans-serif;
      }

      .label-value {
        text-align: right;
      }
    `;
  }

  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
    };
  }

  constructor() {
    super();
    this.label = '';
    this.value = '';
  }

  render() {
    return html` <div class="label-value-con">
      <div class="label-value">
        <label class="label">${this.label}</label>
        <label class="value">${this.value}</label>
      </div>
    </div>`;
  }
}

customElements.define('label-value-view', LabelValueView);
