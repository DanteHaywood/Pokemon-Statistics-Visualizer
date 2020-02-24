import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';

import { csv, interpolateRgb, min, max, mean } from 'd3';
import { format } from 'd3-format';


import ChartWrapper from './ChartWrapper';
import Tooltip from './components/Tooltip';
import AutocompleteContainer from './components/AutocompleteContainer';
import DropdownButtonPopulator from './components/DropdownButtonPopulator';
import KpiCard from './components/KpiCard';
import PokemonBadge from './components/PokemonBadge';
import PokemonTypeBadge from './components/PokemonTypeBadge';
import PokemonCard from './components/PokemonCard';


class App extends Component {

  state = {
    data: [],
    filteredData: [],
    hoveredDatum: null,
    selectedPokemon: [],
    lineAxes: ['HP','Attack','Defense','Sp. Atk','Sp. Def', 'Speed', 'Total'],
    allTypes: ['Bug','Dark','Dragon','Electric','Fairy','Fighting','Fire',
                    'Flying','Ghost','Grass','Ground','Ice','Normal','Poison',
                    'Psychic','Rock','Steel','Water'],
    selectedTypes: [],
    selectedXAxis: 'HP',
    selectedYAxis: 'Defense',
    nPokemon: null,
    highestTotal: null,
    lowestTotal: null,
    meanTotal: null,
  }

  componentWillMount(){
    csv('https://raw.githubusercontent.com/DanteHaywood/Pokemon-Statistics-Visualizer/master/Pokemon.csv')
      .then(data => {
        this.setState({ 'data':data, 'filteredData':data, 'selectedTypes':this.state.allTypes});
        this.nPokemon();
        this.highestTotal();
        this.lowestTotal();
        this.meanTotal();
      })
      .catch(error => console.log(error));
  }

  renderChart() {
    if (this.state.data.length === 0){
      return (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="dark" />
          <div>Loading data...</div>
        </div>
      )
    } else {
      return (
        <React.Fragment>
        <ChartWrapper data={this.state.filteredData}
              hoveredDatum={this.state.hoveredDatum}
              selectedXAxis={this.state.selectedXAxis}
              selectedYAxis={this.state.selectedYAxis}
              highlights={this.state.selectedPokemon}
              onClick={this.selectPokemon}
              color={this.colorPokemon}
              columnId={"#col-chart1"} />
        </React.Fragment>
      );
    }
  }

  renderAutocomplete() {
    if (this.state.data.length === 0){
      return null
    } else {
      return (
        <AutocompleteContainer data={this.state.filteredData} selectFunc={this.selectPokemon}></AutocompleteContainer>
      );
    }
  }

  renderXAxisDropdown() {
    if (this.state.data.length === 0){
      return null
    } else {
      return (
        <DropdownButtonPopulator data={this.state.lineAxes}
          selector={this.selectXAxis}>
          {item => {
            return <Dropdown.Item key={item + '-X'}>{item}</Dropdown.Item>;
          }}</DropdownButtonPopulator>
      );
    }
  }
  selectXAxis = (item) => {
    this.setState({ selectedXAxis: item })
  }

  renderYAxisDropdown() {
    if (this.state.data.length === 0){
      return null
    } else {
      return (
        <DropdownButtonPopulator data={this.state.lineAxes}
          selector={this.selectYAxis}>
          {item => {
            return <Dropdown.Item key={item + '-Y'}>{item}</Dropdown.Item>;
          }}</DropdownButtonPopulator>
      );
    }
  }
  selectYAxis = (item) => {
    this.setState({ selectedYAxis: item })
  }

  renderTypeDropdown() {
    if (this.state.data.length === 0){
      return null
    } else {
      return (
        <DropdownButtonPopulator
          data={this.state.allTypes.filter(type => {
            return (this.state.selectedTypes.indexOf(type) < 0)
          })}
          selector={this.selectType}>
          {item => {
            return <Dropdown.Item key={item + 'type'}>{item}</Dropdown.Item>;
          }}</DropdownButtonPopulator>
      );
    }
  }

  selectPokemon = (d) => {
    const check = (pokemon) => pokemon.Name === d.Name;
    if (this.state.selectedPokemon.some(check)) {
      this.removeSelectedPokemon(d.Name)
    } else {
      var state = {}
      state.selectedPokemon = [...this.state.selectedPokemon, d]
      state.filteredData = this.filterPokemonTypes(this.state.selectedTypes, state.selectedPokemon)
      this.setState( state )
    }
  }

  selectType = (type) => {
    const check = (typeIn) => typeIn === type;
    if (this.state.selectedTypes.some(check)) {
      const newTypes = this.state.selectedTypes.filter(typeIn => {
        return typeIn !== type
      })
      const newData = this.filterPokemonTypes(newTypes)
      this.setState({ 'selectedTypes':newTypes, 'filteredData':newData })
    } else {
      const newTypes = [...this.state.selectedTypes, type]
      const newData = this.filterPokemonTypes(newTypes)
      this.setState({ 'selectedTypes':newTypes, 'filteredData':newData })
    }
  }

  removeSelectedPokemon = (d) => {
    const datum = this.state.data.filter(d2 => {
      return d2.Name === d
    })[0]
    var state = {}
    if (
        (this.state.selectedTypes.indexOf(datum["Type 1"]) < 0) &&
        (this.state.selectedTypes.indexOf(datum["Type 2"]) < 0)
      ){
        state.filteredData = this.state.filteredData.filter(d2 => d2.Name !== d)
      }
    state.selectedPokemon = this.state.selectedPokemon.filter(pokemon => {
      return pokemon.Name !== d
    })
    this.setState( state )
  }

  clearAllSelectedPokemon = () => {
    this.setState({ 'selectedPokemon': [] })
  }

  clearAllSelectedTypes = () => this.setState({ 'selectedTypes': [] })

  addAllTypes = () => {
    const newData = this.state.data
    this.setState({ 'selectedTypes':this.state.allTypes, 'filteredData':newData })
  }

  filterOutSinglePokemon = (d) => {
    const newData = this.state.filteredData.filter(pokemon =>{
      return pokemon.Name !== d
    })
    return newData;
  }

// Need speed up
// Returns a set of data instead of setting state to do one big async setState
  filterPokemonTypes = (newTypes, selectedPokemon=this.state.selectedPokemon) => {
    const selectedNames = selectedPokemon.map(d => d.Name)
    const newData = this.state.data.filter(d => {
      if(d["Type 2"]){
        return (
                ((newTypes.indexOf(d["Type 1"]) > -1) &&
                (newTypes.indexOf(d["Type 2"]) > -1)) ||
                (selectedNames.indexOf(d.Name) > -1)
              )
      } else {
        return ((newTypes.indexOf(d["Type 1"])) > -1 ||
                (selectedNames.indexOf(d.Name) > -1)
              )
      }
    })
    this.nPokemon();
    this.highestTotal();
    this.lowestTotal();
    this.meanTotal();
    return newData;
  }

  colorPokemon = (datum, onlyType=0) => {

    function colors(type){
      if(type.length !== 0){
        if(type === "Normal"){ return "#a8a878"}
        else if(type === "Fire"){ return "#f08030"}
        else if(type === "Fighting"){ return "#c03028"}
        else if(type === "Water"){ return "#6890f0"}
        else if(type === "Flying"){ return "#a890f0"}
        else if(type === "Grass"){ return "#78c850"}
        else if(type === "Poison"){ return "#a040a0"}
        else if(type === "Electric"){ return "#f8d030"}
        else if(type === "Ground"){ return "#e0c068"}
        else if(type === "Psychic"){ return "#f85888"}
        else if(type === "Rock"){ return "#b8a038"}
        else if(type === "Ice"){ return "#98d8d8"}
        else if(type === "Bug"){ return "#a8b820"}
        else if(type === "Dragon"){ return "#7038f8"}
        else if(type === "Ghost"){ return "#705898"}
        else if(type === "Dark"){ return "#705848"}
        else if(type === "Steel"){ return "#b8b8d0"}
        else if(type === "Fairy"){ return "#ee99ac"}
        else if(type === "???"){ return "#68a090"}
      } else { return ""}
    }
    if(onlyType === 0){
      const type1 = datum["Type 1"];
      const type2 = datum["Type 2"];
      const type1Color = colors(type1);
      const type2Color = colors(type2);
      const colorFinal = interpolateRgb(type1Color, type2Color)(0.5);
      return colorFinal;
    } else {
      return colors(datum);
    }

  }

  // KPI updates
  nPokemon = () => this.setState({ 'nPokemon': format(".3s")(this.state.filteredData.length) });
  highestTotal = () => this.setState({ 'highestTotal' : format(".3s")(max(this.state.filteredData, d => +d.Total)) });
  lowestTotal = () => this.setState({ 'lowestTotal' : format(".3s")(min(this.state.filteredData, d => +d.Total)) });
  meanTotal = () => this.setState({ 'meanTotal' : format(".3s")(mean(this.state.filteredData, d => +d.Total)) });

  render() {
    return (
      <React.Fragment>
        <Container fluid={true} className="pt-4 pl-4 pb-4 text-dark">
          <Row>
            {/* Nav Column */}
            <Col md={2} xs={12} className="pt-2 filter-col poke-border">
              <h3>Explore</h3>
              <br/>
              <div className="mb-3">{this.renderAutocomplete()}
                {function( ){
          				if( this.state.selectedPokemon.length !== 0 ) {
                    return (
                      <React.Fragment>
            					{this.state.selectedPokemon.map(d => (
                          <PokemonBadge key={"pokemon-badge" + d.Name}
                            color={this.colorPokemon(d)}
                            text={d.Name}
                            onClick={this.removeSelectedPokemon}
                          />
                      ))}
                      <br/>
                      <Button variant="outline-danger" size="sm" className="mt-1" onClick={this.clearAllSelectedPokemon}>Clear All Pokemon</Button>
                      </React.Fragment>
                    )
          				} else {
          					return null
          				}
          			}.bind( this )( )}
                </div>
              <Form>
                <Form.Group>
                  <Form.Label className="X-Axis-Menu-Label">X-Axis: <b>{this.state.selectedXAxis}</b></Form.Label>
                  <DropdownButton id="dropdown-item-button" title="Update X-Axis" variant="outline-primary">
                    {this.renderXAxisDropdown()}
                  </DropdownButton>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="Y-Axis-Menu-Label">Y-Axis: <b>{this.state.selectedYAxis}</b></Form.Label>
                  <DropdownButton id="dropdown-item-button" title="Update Y-Axis" variant="outline-primary">
                    {this.renderYAxisDropdown()}
                  </DropdownButton>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="Type-Menu-Label"><b>Filter Pokemon Types</b></Form.Label>
                  <br/>
                  {function( ){
                  if( this.state.selectedTypes.length !== 0 ) {
                    return (
                      <React.Fragment>
            					{this.state.selectedTypes.map(d => (
                          <PokemonTypeBadge key={"pokemon-type-badge" + d}
                            color={this.colorPokemon(d, 1)}
                            text={d}
                            onClick={this.selectType}
                          />
                      ))}
                      <br/>
                      <ButtonToolbar className="mt-3">
                        <DropdownButton id="dropdown-item-button" title="Add Type" variant="outline-primary">
                          {this.renderTypeDropdown()}
                        </DropdownButton>
                        <Button variant="outline-secondary"  onClick={this.addAllTypes}>Add All Types</Button>
                        <Button variant="outline-danger"   onClick={this.clearAllSelectedTypes}>Clear All Types</Button><br/>
                      </ButtonToolbar>
                      </React.Fragment>
                    )
          				} else {
          					return (
                      <React.Fragment>
                        <ButtonToolbar className="mt-3">
                          <DropdownButton id="dropdown-item-button" title="Add Type" variant="outline-primary">
                            {this.renderTypeDropdown()}
                          </DropdownButton>
                          <Button variant="outline-secondary"   onClick={this.addAllTypes}>Add All Types</Button><br/>
                        </ButtonToolbar>
                        <p>Add a type to update chart.</p>
                      </React.Fragment>
                    )
          				}
          			}.bind( this )( )}
                </Form.Group>

              </Form>
            </Col> {/* End Nav Column */}

            {/* Main Column */}
            <Col md={10} xs={12} className="px-4" >
              {/* Main dashboard */}

              <Row className="justify-content-md-center"> {/* KPI Row */}
                <Col md={3} xs={6}>
                  <KpiCard key='kpi1' className="poke-border" kpi={this.state.nPokemon}
                    title="Number of Pokemon"
                    units="Pokemon"
                    formatFunc={format(".2s")}
                    id='kpi1'></KpiCard>
                </Col>
                <Col md={3} xs={6}>
                  <KpiCard key='kpi2' className="poke-border" kpi={this.state.highestTotal}
                    title="Highest Total"
                    units="Stat Points"
                    formatFunc={format(".2s")}
                    id='kpi2'></KpiCard>
                </Col>
                <Col md={3} xs={6}>
                  <KpiCard key='kpi3' className="poke-border" kpi={this.state.lowestTotal}
                    title="Lowest Total"
                    units="Stat Points"
                    formatFunc={format(".2s")}
                    id='kpi3'></KpiCard>
                </Col>
                <Col md={3} xs={6} >
                  <KpiCard key='kpi4' className="poke-border"  kpi={this.state.meanTotal}
                    title="Average Total"
                    units="Stat Points"
                    formatFunc={format(".2s")}
                    id='kpi4'></KpiCard>
                </Col>
              </Row>

              {this.state.selectedXAxis === this.state.selectedYAxis ?
                <Alert key="same-axis-alert" variant="info">
                  Tip: The same X and Y axis on a plot will always produce a straight line. Try differentiating them for more interesting results.
                </Alert>
                : null
              }

              <Row>
                 {/*First row of charts*/}
                  <Col md={12} xs={12} id="col-chart1">
                    {this.renderChart()}
                    {this.state.selectedPokemon ?
                      null
                    : null
                    }
                  </Col>
              </Row>

              <Row> {/*Second row of charts*/}
                {function( ){
          				if( this.state.selectedPokemon.length !== 0 ) {
          					return (this.state.selectedPokemon.map(d => (
                      <Col md={3} xs={6}  key={"pokemon-card-col-" + d.Name}>
                        <PokemonCard key={"pokemon-card-" + d.Name}
                          pokemon={d}
                          color1={this.colorPokemon(d["Type 1"], 1)}
                          color2={this.colorPokemon(d["Type 2"], 1)}
                          onClick={() => null}
                          onClickType={() => null}/>
                      </Col>
                    ))
                    )
          				} else {
          					return null
          				}
                  }.bind( this )( )}
              </Row>



              {/* End Main dashboard */}
            </Col> {/* End Main Column */}

          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
