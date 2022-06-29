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
      socket: { type: WebSocket },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.connectSocket();
  }

  connectSocket() {
    try {
      this.socket = new WebSocket('ws://localhost:8080/socket?kkkkk');
      console.log('connection state:', this.socket.readyState);
    } catch (error) {
      console.log('web socket connection error', error);
      return;
    }

    this.socket.addEventListener('open', this.onSocketOpen);
    this.socket.addEventListener('error', this.onSocketError);
    this.socket.addEventListener('message', this.onSocketMessage);
    this.socket.addEventListener('close', this.onSocketClose);
  }

  onSocketMessage = event => {
    const quote = JSON.parse(event.data);
    console.log('Websocket received message:', quote);
    this.quotes = this.quotes.map(q => (q.name === quote.name ? quote : q));
  };

  onSocketError = event => {
    console.log('Websocket error:', event);
  };

  onSocketOpen = event => {
    console.log('Websocket opened', event);
  };

  onSocketClose = event => {
    console.log('Websocket closed', event);
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.socket) {
      this.socket.close();
    }
  }

  async firstUpdated() {
    const request = new Request('http://localhost:8080/stock/stocks?username=kkkkkk', {
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
customElements.define('quote-elem', Quote);
