import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

export default class DropdownButtonPopulator extends Component {
  constructor ( props, context ) {
		super( props, context );
		this.selector = this.props.selector;

		this.state = {
      data: this.props.data,
			selected: null,
      axis: this.props.axis
		};
	}

  select( item ) {
		var state = { };
		state.selected = item;


    this.selector(item);

		this.setState( state );
	}

  componentWillReceiveProps( nextProps ) {
		this.setState( {
      data: nextProps.data,
			selected: nextProps.selected,
			axis: nextProps.axis
		} );
	}

  render() {
		return (
      <React.Fragment>
          {function(){
  					if( this.state.data.length ) {
  						return (
                this.state.data.map(function(item, index){
                  return React.cloneElement( this.props.children( item ), {
                    onSelect: () => this.select(item)
                  })
                }.bind( this ))
  					)} else {
              return null};
  				}.bind(this)()}
      </React.Fragment>
    );
  }
}

DropdownButtonPopulator.propTypes = {
  children: PropTypes.func
};
