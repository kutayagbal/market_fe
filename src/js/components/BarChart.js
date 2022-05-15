import * as d3 from 'd3';
import { html, LitElement } from 'lit';

export class BarChart extends LitElement {
  static get properties() {
    return { graphData: { type: [Object] }, styleData: { type: Object } };
  }

  constructor() {
    super();
    this.styleData = {
      margin: { top: 10, right: 60, bottom: 50, left: 60 },
      width: 300,
      height: 200,
    };
    this.graphData = [
      { label: 'Kutay', value: 10 },
      { label: 'Agbal', value: 5 },
      { label: 'Ali', value: 3 },
      { label: 'Kemal', value: 8 },
      { label: 'Ziya', value: 6 },
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    addEventListener('resize', this.handleResize);
    console.log('resize listener added....');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleResize);
    console.log('resize listener removed....');
  }

  updated() {
    this.generateVerticalBarChart();
  }

  firstUpdated() {
    this.generateVerticalBarChart();
  }

  handleResize = () => {
    console.log('resizing....');
    const svg = document.getElementsByTagName('bar-chart-elem')[0];

    if (window.innerWidth < svg.styleData.width) {
      this.styleData = { ...this.styleData, width: window.innerWidth };
    }

    if (window.innerHeight < svg.styleData.height) {
      this.styleData = { ...this.styleData, height: window.innerHeight };
    }
  };

  // resetGraph() {
  //   this._svg.remove().exit();
  //   if (this.graphData.length > 0) {
  //     this.generateVerticalBarChart();
  //   }
  // }

  // componentDidUpdate() {
  //   d3.select(this.shadowRoot.querySelector('svg')).select('#vertical_bar_chart_svg').remove().exit();

  //   if (this.props.data) {
  //     this.generateVerticalBarChartRef(this.props.data);
  //   }
  // }

  // componentDidMount() {
  //   const { parentElement } = document.getElementById('graph-svg');

  //   this.setState({
  //     width: parentElement.clientWidth - 150,
  //     height: 300,
  //     margin: { top: 10, right: 60, bottom: 50, left: 60 },
  //   });

  //   window.addEventListener('resize', this.handleResize);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.handleResize);
  // }

  generateVerticalBarChart() {
    const { margin, width, height } = this.styleData;

    // const svg = d3
    //   .select(this.shadowRoot.querySelector('svg'))
    //   // .append('svg')
    //   .attr('id', 'vertical_bar_chart_svg')
    //   .attr('width', width + margin.left + margin.right)
    //   .attr('height', height + margin.top + margin.bottom);
    const svg = d3.select(this.shadowRoot.querySelector('svg'));
    // svg.attr('margin');

    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xMax = d3.max(this.graphData, d => d.value);

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(this.graphData.map(d => d.label))
      .padding(0.4);

    const y = d3.scaleLinear().domain([0, xMax]).range([height, 0]);

    chart.append('g').call(d3.axisLeft(y).ticks(xMax)).selectAll('text').attr('font-size', '15px');

    chart
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('font-size', '12px');

    chart
      .selectAll('#mybar')
      .data(this.graphData)
      .enter()
      .append('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', '#E2A85A');

    chart
      .selectAll('#mybar')
      .data(this.graphData)
      .enter()
      .append('text')
      .text(d => d.value)
      .attr('text-anchor', 'middle')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) + 20)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '15px')
      .attr('fill', 'black');
  }

  render() {
    return html`<svg
      id="graph-svg"
      width=${this.styleData.width + this.styleData.margin.left + this.styleData.margin.right}
      height=${this.styleData.height + this.styleData.margin.top + this.styleData.margin.bottom}
    ></svg>`;
  }
}

customElements.define('bar-chart-elem', BarChart);
