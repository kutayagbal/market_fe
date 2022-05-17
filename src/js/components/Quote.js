import { html, css, LitElement } from 'lit';
import { moneyFormatter, rateFormatter } from './Util.js';

export class Quote extends LitElement {
  static get styles() {
    return css`
      .quote {
        width: 250px;
        border: 2px solid sandybrown;
        border-radius: 20px;
        transition-duration: 0.1s;
        box-shadow: 5px 8px 5px rgba(0, 0, 0, 0.3);
        background-color: beige;
      }
      .quote:hover {
        background-color: azure;
        border-color: cornflowerblue;
        box-shadow: 10px 16px 10px rgba(0, 0, 0, 0.5);
      }
      .quote:hover .quote-buy-button {
        background-color: azure;
      }
      .quote:hover .quote-sell-button {
        background-color: azure;
      }
      /* .quote:hover .quote-button-con {
        visibility: visible
      } */
      .quote-title-con {
        margin: 5px 5px 0px 5px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .quote-title {
        font-size: x-large;
        font-weight: 800;
        font-family: Arial, Helvetica, sans-serif;
      }
      .quote-rate-con {
        margin: 0px 25px 5px 5px;
        text-align: right;
      }
      .quote-rate {
        font-size: xx-large;
        font-weight: 800;
        font-family: Arial, Helvetica, sans-serif;
      }
      .quote-rate-up {
        color: #4caf50;
      }
      .quote-rate-down {
        color: #f44336;
      }
      .quote-prices-con {
        line-height: 0.8;
        margin: 0px 10px;
      }
      .quote-button-con {
        /* visibility: hidden; */
        text-align: center;
        margin-top: 15px;
        margin-bottom: 10px;
      }
      .quote-button {
        background-color: beige;
        font-weight: 600;
        font-size: medium;
        padding: 10px 25px;
        text-align: center;
        margin: 5px;
        transition-duration: 0.1s;
        cursor: pointer;
        border-radius: 20px;
      }
      .quote-buy-button {
        color: #4caf50;
        margin-right: 40px;
        border: 1px solid #4caf50;
      }
      .quote-buy-button:hover {
        background-color: #4caf50 !important;
        color: beige;
      }
      .quote-sell-button {
        color: #f44336;
        border: 1px solid #f44336;
      }
      .quote-sell-button:hover {
        background-color: #f44336 !important;
        color: beige;
      }
    `;
  }

  static get properties() {
    return {
      quote: { type: Object },
    };
  }

  constructor() {
    super();
    this.quote = { name: '', price: 0, bestAsk: 0, bestBid: 0, rate: 0, priceHistory: [] };
  }

  renderTitle() {
    return html`<div class="quote-title-con">
      <label class="quote-title">${this.quote?.name}</label>
    </div>`;
  }
  renderGraph() {
    return html`<line-graph-elem
      .graphData=${this.quote?.priceHistory}
      .styleData=${{
        margin: { top: 10, right: 10, bottom: 20, left: 30 },
        width: 200,
        height: 150,
      }}
    ></line-graph-elem>`;
  }

  renderRate() {
    if (this.quote?.rate < 0) {
      return html`<div class="quote-rate-con">
        <label class="quote-rate quote-rate-down"
          >${rateFormatter.format(this.quote?.rate / 100)}</label
        >
      </div>`;
    } else {
      return html`<div class="quote-rate-con">
        <label class="quote-rate quote-rate-up"
          >${rateFormatter.format(this.quote?.rate / 100)}</label
        >
      </div>`;
    }
  }

  renderPrices() {
    return html` <div class="quote-prices-con">
      <label-value-view
        label="Price :"
        value=${moneyFormatter.format(this.quote?.price)}
      ></label-value-view>
      <label-value-view
        label="Best Bid :"
        value=${moneyFormatter.format(this.quote?.bestBid)}
      ></label-value-view>
      <label-value-view
        label="Best Ask :"
        value=${moneyFormatter.format(this.quote?.bestAsk)}
      ></label-value-view>
    </div>`;
  }

  renderFooter() {
    return html`<div class="quote-button-con">
      <button class="quote-button quote-buy-button">BUY</button
      ><button class="quote-button quote-sell-button">SELL</button>
    </div>`;
  }

  render() {
    return html`<div class="quote">
      ${this.renderTitle()}${this.renderGraph()}${this.renderRate()}${this.renderPrices()}${this.renderFooter()}
    </div>`;
  }
}

customElements.define('quote-elem', Quote);
