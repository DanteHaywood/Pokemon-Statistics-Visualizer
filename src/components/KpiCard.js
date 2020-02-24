import React, { Component } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import { select } from 'd3-selection';
import transition from 'd3-transition';


export default class KpiCard extends Component {

  constructor ( props, context ) {
		super( props, context );
		this.state = {
			kpi: this.props.kpi,
			title: this.props.title,
      units: this.props.units,
      formatFunc: this.props.formatFunc,
      id: this.props.id
		};

    this.update(this.state.kpi);
	}

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.kpi !== this.state.kpi ){
      this.setState({ kpi : nextProps.kpi });
    }
	}

  componentDidUpdate(){
    this.update();
  }

  update(){
    select("#" + this.state.id + "-val")
    .transition(500)
      .text(this.state.kpi)
  }

  render(){
    return(
      <React.Fragment>
        <Card
          id={this.state.id} className={"kpi-card mb-5 " + this.props.className}
          >
          <Card.Header className="text-dark" style={{ backgroundColor: 'white' }}>{this.state.title}</Card.Header>
          <Card.Body>
            <Card.Title><h3 id={this.state.id + "-val"}></h3></Card.Title>
            <Card.Text className="text-muted">{this.state.units}</Card.Text>
          </Card.Body>
        </Card>
      </React.Fragment>
    )
  }




}
