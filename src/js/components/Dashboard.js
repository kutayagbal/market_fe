import { html, css, LitElement } from 'lit';
import { Quote } from './Quote';

export class Dashboard extends LitElement {
  static get styles() {
    return css`
      .dashboard {
        box-sizing: border-box;
      }
      .quote-row {
        margin: 0 -5px;
      }
      .quote-row:after {
        content: '';
        display: table;
        clear: both;
      }
      .quote-column {
        float: left;
        width: fit-content;
        padding: 10px;
      }
    `;
  }

  static get properties() {
    return {
      quotes: { type: [Quote] },
    };
  }

  async firstUpdated() {
    const request = new Request('http://localhost:8080/stock/stocks', {
      method: 'GET',
    });

    fetch(request)
      .then(response => {
        response.json().then(data => {
          console.log('Got the Quotes');
          this.quotes = data.map(quote => {
            return {
              ...quote,
              priceHistory: quote.priceHistory.map(price => {
                return { ...price, date: new Date(price.date) };
              }),
            };
          });
        });
      })
      .catch(error => console.error(error));
  }

  render() {
    return html`<div class="dashboard">
      <div class="quote-row">
        ${this.quotes?.map(quote => {
          return html`<div class="quote-column"><quote-elem .quote=${quote} /></div>`;
        })}
      </div>
    </div>`;
  }
}

customElements.define('dashboard-elem', Dashboard);
