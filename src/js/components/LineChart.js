import { html, css, LitElement, styleMap } from 'lit';
import * as d3 from 'd3';

export class LineChart extends LitElement {
  static get styles() {
    return [
      css`
        .axis {
          font-size: 7px;
          color: slategray;
          font-family: Arial, helvetica, sans-serif;
        }

        .grid line {
          stroke: lightgray;
          stroke-opacity: 0.7;
          shape-rendering: crispEdges;
        }

        .grid0 line {
          stroke: gray;
          stroke-opacity: 0.7;
          shape-rendering: crispEdges;
        }
      `,
    ];
  }

  static get properties() {
    return { graphData: { type: Object } };
  }

  render() {
    return html`
      <div id="graph-container">
        <svg
          style=${{
            width: '95%',
            height: '100px',
            margin: '5px',
          }}
        ></svg>
      </div>
    `;
  }

  // render() {
  //   return html`
  //     <div id="graph-container">
  //       <svg
  //         style=${this.graphData != undefined
  //           ? styleMap(this.graphData.styles)
  //           : {
  //               width: '95%',
  //               height: '100px',
  //               margin: '5px',
  //             }}
  //       ></svg>
  //     </div>
  //   `;
  // }

  async updated() {
    if (this.graphData?.lineChart) {
      this._svg = d3.select(this.shadowRoot.querySelector('svg'));
      this._height =
        this._svg.node().getBoundingClientRect().height -
        this.graphData.lineChart.margin.top -
        this.graphData.lineChart.margin.bottom;
      this._width =
        this._svg.node().getBoundingClientRect().width -
        this.graphData.lineChart.margin.left -
        this.graphData.lineChart.margin.right;
      this._drawChart();
    }
  }

  _drawChart() {
    this._resetRoot();
    if (!this.graphData?.data || this.graphData.data.length === 0) {
      return;
    }

    const dataValues = this.graphData.data.map(data => data.value);
    const maxValue = Math.max(...dataValues, 0);
    const minValue = Math.min(...dataValues, 0);
    const step = d3.tickStep(minValue, maxValue, 5);

    this.yAxisValues = d3.range(
      Math.floor(minValue / step) * step,
      Math.ceil(maxValue / step) * step + step / 2,
      step
    );

    const yAxisMinValue = this.yAxisValues[0];
    const yAxisMaxValue = this.yAxisValues[this.yAxisValues.length - 1];

    let [firstDate, lastDate] = d3.extent(this.graphData.data, d => new Date(d.date));

    // firstDate = d3.timeDay.floor(firstDate); //set the start of the day.
    const xDomain = [firstDate, lastDate]; //this._calculateXDomain(firstDate, lastDate);
    this._x = d3.scaleTime().domain(xDomain).range([0, this._width]);

    this._y = d3.scaleLinear().domain([yAxisMinValue, yAxisMaxValue]).range([this._height, 0]);

    this._drawAxis();
    this._drawGrid();
    this._drawLine();
  }

  _drawAxis() {
    this._root
      .append('g')
      .attr('class', 'axis')
      .attr('id', 'xAxis')
      .attr('transform', `translate(0, ${this._height})`)
      .call(d3.axisBottom(this._x).ticks(d3.timeHour).tickFormat(d3.timeFormat('%H')))
      .call(g => g.selectAll('line').remove()) // removes ticks so preserves only labels
      .call(g => g.select('.domain').remove()); // removes axis solid line

    this._root
      .append('g')
      .attr('class', 'axis')
      .attr('id', 'yAxis')
      .call(
        d3
          .axisLeft(this._y)
          .tickValues(this.yAxisValues)
          .tickFormat(d => d)
      )
      .call(g => g.selectAll('line').remove())
      .call(g => g.select('.domain').remove());
  }

  _drawLine() {
    const line = d3
      .line()
      .x(d => this._x(new Date(d.date)))
      .y(d => this._y(d.value));

    const lines = this._root
      .append('path')
      .datum(this.graphData.data)
      .attr('fill', 'none')
      .attr('stroke', 'cornflowerblue')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    const totalLength = lines.node().getTotalLength();

    lines
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      // .transition()
      // .duration(1000)
      // .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
  }

  _drawGrid() {
    this._root
      .append('g')
      .attr('class', 'grid')
      .attr('id', 'yGrid')
      .selectAll('line')
      .data(this.yAxisValues)
      .join('line')
      .attr('x1', 0)
      .attr('y1', d => this._y(d))
      .attr('x2', this._width)
      .attr('y2', d => this._y(d));

    this._root
      .append('g')
      .attr('class', 'grid')
      .attr('id', 'xGrid')
      .selectAll('line')
      .data(this._x.range())
      .join('line')
      .attr('x1', d => this._x(d))
      .attr('y1', 0)
      .attr('x2', d => this._x(d))
      .attr('y2', this._height);

    // This draws an emphasised zero-line
    this._root
      .append('g')
      .attr('class', 'grid0')
      .attr('id', 'yGrid0')
      .append('line')
      .attr('x1', 0)
      .attr('y1', this._y(0))
      .attr('x2', this._width)
      .attr('y2', this._y(0));
  }

  _resetRoot() {
    this._root?.remove();
    this._root = this._svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.graphData.lineChart.margin.left}, ${this.graphData.lineChart.margin.top})`
      );
  }

  // _calculateXDomain(firstDate, lastDate) {
  //   if (lastDate.getDate() > 15) {
  //     return [firstDate, d3.timeDay.ceil(lastDate)];
  //   }

  //   return [d3.timeDay.floor(firstDate), lastDate];
  // }
}
