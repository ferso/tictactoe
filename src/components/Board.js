
import React from 'react';

class Message extends React.Component {
  render(){
    if(this.props.game){
      return (
        <div className="footer">
          <div ref="warnings" className="warnings">{this.props.warnings}</div>
          <div className="movements">Move {this.props.moves} </div>
          <a href="#" onClick={this.props.restart} > RESTART </a>
        </div>
      )
    }else{
      return (
        <div className="footer">
          <div ref="warnings" className="warnings warnings-draw">{this.props.warnings} </div>
          <div className="movements">Total movements: {this.props.moves} </div>
          <a href="#" onClick={this.props.restart} > NEW GAME </a>
        </div>
      )
    }
  }
}

class Box extends React.Component {
  render() {
      // we defined box style class
      let classBox = 'box';
      if( this.props.loader ){
          classBox += ' box-wait'
      }
       if( !this.props.game  ){    
        classBox += ' box-off'
       }
      if( !this.props.game && this.props.row ){    
          classBox += ' box-off'      
          if( this.props.row.indexOf(this.props.id+1) > -1 ){            
            classBox += ' box-winner'
          }
      }
      if( this.props.empty === 'E'){
        return (
          <div className={classBox} data-id={this.props.id} onClick={this.props.onTurn} ></div>
        );
      }else{
        return (
          <div className={ classBox } > 
            <label data-id={this.props.id}  >{this.props.empty} </label>
          </div>
        );
      }
    }  
}

export default class Board extends React.Component {
  render() {    
  var Boxes = [];
   this.props.boxes.forEach((e,i) => {       
        Boxes.push(<Box key={i} id={i} {...this.props} empty={e} />)
    })
    return (
      <div>
        <h2>TIC TAC TOE BOARD</h2>
        <div className="board">
            {Boxes}  
        </div>
          <Message {...this.props} />
      </div>
    );
  }
}