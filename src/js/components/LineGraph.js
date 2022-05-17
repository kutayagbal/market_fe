import { html, LitElement } from 'lit';
import * as d3 from 'd3';

export class LineGraph extends LitElement {
  defaultStyle = {
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    width: 300,
    height: 300,
  };

  static get properties() {
    return {
      graphData: [{ date: String, value: Number }],
      styleData: {
        margin: { top: Number, right: Number, bottom: Number, left: Number },
        width: Number,
        height: Number,
      },
    };
  }

  constructor() {
    super();
    this.graphData = [];
    this.styleData = {
      margin: { top: 50, right: 50, bottom: 50, left: 50 },
      width: 300,
      height: 300,
    };
  }

  firstUpdated() {
    this.generateGraph();
  }

  generateGraph() {
    const { margin, width, height } = this.styleData;
    const data = this.graphData;

    // set the scales
    var xAxisScale = d3.scaleTime().range([0, width]);
    var yAxisScale = d3.scaleLinear().range([height, 0]);

    // define the line
    var graphLine = d3
      .line()
      .x(d => xAxisScale(d.date))
      .y(d => yAxisScale(d.value));

    // append the svg to the container
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select(this.shadowRoot)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // set domain of the scales
    xAxisScale.domain(d3.extent(data, d => d.date));
    yAxisScale.domain(d3.extent(data, d => d.value));

    // add graph path
    svg
      .append('path')
      .data([data])
      .attr('d', graphLine)
      .attr('fill', 'none')
      .attr('stroke', 'cornflowerblue');

    // add x axis and label ticks with hours
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xAxisScale).ticks(d3.timeHour));

    // add y axis
    svg.append('g').call(d3.axisLeft(yAxisScale));
  }

  render() {
    console.log('rendering...');
    return html`<div />`;
  }
}
