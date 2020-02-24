import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import PokemonBadge from './PokemonBadge';
import PokemonTypeBadge from './PokemonBadge';

export default function PokemonCard(props){

  if(props.pokemon["Type 2"].length !== 0) {
    const badge2 = <PokemonBadge key={"selected-type-badge-" + props.pokemon["Type 2"] + "-" + props.pokemon.Name}
                    color={props.color2}
                    text={props.pokemon["Type 2"]}
                    onClick={props.onClick}>
                  </PokemonBadge>
  } else {
    const badge2 = null
  }
  return (
    <Card className="poke-border">
      <Card.Header as="h5">{props.pokemon.Name}</Card.Header>
      <Card.Body>
        <PokemonTypeBadge myKey={"selected-type-badge-" + props.pokemon["Type 1"] + "-" + props.pokemon.Name}
          color={props.color1}
          text={props.pokemon["Type 1"]}
          onClick={props.onClick}
          onClickType={props.onClickType}>
        </PokemonTypeBadge>
        <PokemonTypeBadge myKey={"selected-type-badge-" + props.pokemon["Type 2"] + "-" + props.pokemon.Name}
          color={props.color2}
          text={props.pokemon["Type 2"]}
          onClick={props.onClick}
          onClickType={props.onClickType}>
        </PokemonTypeBadge>
        <br/>
        <br/>
          <h4>Statistics</h4>
          <div>
            <Table striped bordered hover size="sm">
            <tbody>
             <tr>
               <td>HP</td>
               <td>{props.pokemon.HP}</td>
             </tr>
             <tr>
               <td>Attack</td>
               <td>{props.pokemon.Attack}</td>
             </tr>
             <tr>
               <td>Defense</td>
               <td>{props.pokemon.Defense}</td>
             </tr>
             <tr>
               <td>Sp. Atk</td>
               <td>{props.pokemon["Sp. Atk"]}</td>
             </tr>
             <tr>
               <td>Sp. Def</td>
               <td>{props.pokemon["Sp. Def"]}</td>
             </tr>
             <tr>
               <td>Speed</td>
               <td>{props.pokemon.Speed}</td>
             </tr>
             <tr>
               <td>Total</td>
               <td>{props.pokemon.Total}</td>
             </tr>
             </tbody>
           </Table>

          </div>
          <Card.Text>
        </Card.Text>
        <Button variant="danger">Remove</Button>
      </Card.Body>
    </Card>

  )
}
