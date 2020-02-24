import React, { Component } from 'react';
import Autocomplete from './Autocomplete';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
//FROM: Luca Colonnello
//https://codepen.io/LucaColonnello/pen/waYppV/

export default class AutocompleteContainer extends Component {
	constructor ( props, context ) {
		super( props, context );
		this.data = this.props.data;
		this.selectFunc = this.props.selectFunc;

		this.state = {
			results: [ ],
			loading: false,
			selected: ''
		};
	}

	search ( value ) {
		return this.data.filter( function( item ) {
			return ( new RegExp(value, 'i') ).test( item.Name );
		} );
	}

	onSearch( value ) {
		var time = this.time = (new Date( )).getTime( );
		this.state.results = [ ];

		value = value.trim( );
		if( value == "" ) {
			this.state.loading = false;
			this.setState( this.state );
			return;
		}

		this.state.loading = true;
		this.setState( this.state );

		setTimeout( function( ) {
			if( this.time != time ) return;
			this.state.loading = false;
			this.state.results = this.search( value ) || [ ];
			this.setState( this.state );
		}.bind( this ), 1000 );
	}

	onSelect( result, index ) {
		this.state.selected = result;
		this.state.results = [ ];
		this.setState( this.state );
		this.selectFunc( this.state.selected );
	}

	render( ) {
		return (
      <React.Fragment>
      <div className="selected">
        Search for a Pokemon<br />
				(Examples: Bulbasaur, Pikachu, Charizard, ...)
      </div>
      <div className="autocomplete_container">
        <Autocomplete
        onSearch={this.onSearch.bind( this )}
        onSelect={this.onSelect.bind( this )}
        results={this.state.results}
        loading={this.state.loading}>
          {item => {
            return <ListGroup.Item key={item.Name} action>{item.Name}</ListGroup.Item>;
          }}
        </Autocomplete>
			</div>
			{function( ){
				if( this.state.loading ) {
					return <span>Loading...</span>
				} else if( this.state.selected.length !== 0 ){
					return <span></span>
				} else if( this.state.results.length !== 0) {
					return ""
				} else {
					return null
				}

			}.bind( this )( )}
      </React.Fragment>
		);
	}
}

Autocomplete.propTypes = {
  children: PropTypes.func
};
