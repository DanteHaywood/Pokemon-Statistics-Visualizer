import React, { Component } from 'react';
import D3Chart from './D3Chart';

import Tooltip from './components/Tooltip';

export default class ChartWrapper extends Component {


	componentDidMount() {
		this.setState({
			chart: new D3Chart(this.refs.chart, this.props.data, this.props.selectedXAxis, this.props.selectedYAxis,
				this.props.highlights, this.props.onClick, this.props.color, this.props.columnId)
		})
	}

	shouldComponentUpdate() {
		return false
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.selectedXAxis !== this.props.selectedXAxis ||
			nextProps.selectedYAxis !== this.props.selectedYAxis){
			this.state.chart.update(nextProps.selectedXAxis,nextProps.selectedYAxis, nextProps.data)
			//this.state.chart.highlight(nextProps.highlights)
		}
		if(nextProps.highlights !== this.props.highlights){
			this.state.chart.highlight(nextProps.highlights)
		}
		if(nextProps.data !== this.props.data){
			console.log("new data in update:", nextProps.data);
			this.state.chart.update(nextProps.selectedXAxis,nextProps.selectedYAxis, nextProps.data)
			this.state.chart.highlight(nextProps.highlights)
		}
	}

	render(props) {
		return <div className="chart-area" ref="chart"></div>
	}
}
