import React from "react";
import Badge from "react-bootstrap/Badge";

export default function PokemonTypeBadge(props){
  const style = {
    backgroundColor: props.color,
    color: "white",
    cursor: "pointer"
  }

  return (

    <Badge pill
      key = {props.myKey}
      className="col-md-4 col-sm-12"
      style={style}
      onClick={() => props.onClick(props.text)}>
      {props.text}
    </Badge>

  )
}
