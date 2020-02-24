import React, { Component } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
//FROM: Luca Colonnello
//https://codepen.io/LucaColonnello/pen/waYppV/

export default class Autocomplete extends Component {

	constructor ( props, context ) {
		super( props, context );

		this.state = {
			selected: false,
			hover: false,
			results: this.props.results,
			loading: this.props.loading
		};
	}

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			selected: false,
			hover: false,
			results: nextProps.results,
			loading: nextProps.loading
		} );
	}

	onChange( e ) {
		this.props.onSearch( e.target.value );
	}

	onKeyUp( e ) {
		var
			keyCode = e.keyCode || e.which
		,	hover = false
		,	selected = false
		,	state = {
				results: this.state.results,
				loading: this.state.loading
			}
		;

		if( this.state.results.length ) {
			switch( keyCode ) {
				case 38: // up
					if(
						this.state.hover === false ||
						( this.state.hover - 1 ) < 0
					) {
						hover = this.state.results.length - 1;
					} else {
						hover = this.state.hover - 1;
					}

					break;

				case 40: // down
					if(
						this.state.hover === false ||
						( this.state.hover + 1 ) > ( this.state.results.length - 1 )
					) {
						hover = 0;
					} else {
						hover = this.state.hover + 1;
					}

					break;

				case 13: // enter
					if( this.state.hover !== false )
						selected = this.state.hover;
					break;
			}
		}

		if( selected === false ) {
			state.selected = false;
			state.hover = hover;

			this.setState( state );
		} else {
			this.select( selected );
		}
	}

	onBlur( e ) {
		setTimeout( function(){
			var state = { };
			state.selected = false;
			state.hover = false;
			state.results = [ ];

			this.setState( state );
		}.bind( this ), 250 );
	}

	select( index ) {
		var state = { };
		state.selected = index;
		state.hover = false;
		this.refs.input.value = "";

		// call the callback
		this.props.onSelect( this.state.results[ state.selected ], state.selected );
		state.results = [ ];

		this.setState( state );
	}

	render( ) {
		return (
      <React.Fragment>
			<div className="autocomplete">
					<FormControl ref="input" className="mb-2"
						onBlur={this.onBlur.bind(this)}
						onKeyUp={this.onKeyUp.bind( this )}
						onChange={this.onChange.bind( this )}
						placeholder="Search..." />

        <div style={{clear: "both"}} />

				{function(){
					if( this.state.results.length ) {
						return (

							<ListGroup>	{( !this.state.selected ) ? this.state.results.map(function( item, index ){
									return React.cloneElement( this.props.children( item ), {
										onClick: this.select.bind( this, index )
									} );
								}.bind( this )) : ''}

						</ListGroup>
					)
					} else return "";
				}.bind(this)()}
			</div>
      </React.Fragment>
		);
	}
}
