import React, { Component } from 'react';

export default class Tooltip extends Component {

  constructor(props){
    super(props);
    this.state = {
      styles: {},
      d: null,
      x: null,
      y: null
    }

  }

  componentWillMount() {
    const x = this.props.tTipCoords[this.props.id + "xCoord"];
    const y = this.props.tTipCoords[this.props.id + "yCoord"];
    this.setState({
                    styles: {
                      left: x - 30 + "px",
                      top: y + "px"
                    },
                    d: this.props.d,
                    x: x,
                    y: y
                   })

  }

  componentWillReceiveProps(nextProps) {
		// this.state.chart.update(nextProps)
    if (this.props !== nextProps) {
      console.log(this.props);
      console.log(nextProps);
      const x = nextProps.tTipCoords[nextProps.id + "xCoord"];
      const y = nextProps.tTipCoords[nextProps.id + "yCoord"];
      this.setState({
                      styles: {
                        left: x - 30 + "px",
                        top: y + "px"
                      },
                      d: nextProps.d,
                      x: x,
                      y: y
                     })
      console.log(this.state);
    }
	}

  render() {
    return (
      <div className="Tooltip34563456" style={this.state.styles}>
        <table>
          <thead>
            <tr>
              <th colSpan="2">{this.state.d.Name}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="1">HP</td>
              <td colSpan="1">{this.state.d.HP}</td>
            </tr>
            <tr>
              <td colSpan="1">Defense</td>
              <td colSpan="1">{this.state.d.Defense}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
