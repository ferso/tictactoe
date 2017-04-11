import React from 'react';
import _ from 'lodash';

/*jshint loopfunc: true */


class Box extends React.Component {
  render() {
    if( this.props.empty === 'E'){
      return (
        <div className="box" onClick={this.props.onTurn} > 
          <label className="empty"  data-id={this.props.id}  >{this.props.player}</label>
        </div>
      );
    }else{
      return (
        <div className="box" > 
          <label data-id={this.props.id}  >{this.props.empty}</label>
        </div>
      );
    }
  }
}

class Board extends React.Component {
  render() {
  var Boxes = [];
   this.props.boxes.map((e,i) =>{          
        Boxes.push(<Box key={i} id={i} {...this.props} empty={e} />)
    })
    return (
      <div className="board">        
            {Boxes}
      </div>
    );
  }
}


class App extends React.Component {
  constructor(props,context){
    super(props,context);
    this.state = {
        game    :'open',
        player  :'X',
        moves   :0,
        boxes   :Array(9).fill('E')
    }

    //Available options for win
    this.winOptions  = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

    // status of boxes
    this.boxes = Array(9).fill('E');
  }
  IA(){ 
    let x = [];
    let o = [];
    let e = [];
    let m = [];

    this.boxes.map((v,i) => { if( v === 'X') { x.push(i+1) } });
    this.boxes.map((v,i) => { if( v === 'O') { o.push(i+1) } });
    this.boxes.map((v,i) => { if( v === 'E') { e.push(i+1) } });
    this.boxes.map((v,i) => { if( v !== 'E') { m.push(i+1) } });
    //var emptys = this.boxes.filter((v,i) => { return v === 'E' ? i : null });

    //set index
    let index = this.findMove(x,m,o);

    //set index occuped in board
    this.boxes[ index ] = 'O';    
    
    //set the turn after assing slot
    this.setTurn();
    
  }
  findMove(x,m,o){
      // set option win array
      let a;
      let b;
      let c;
      let index;

      let cx = x;
      let co = o;
      let cm = m;
       
       x = new Set(x);      
       o = new Set(o);
       m = new Set(m);

      if(this.state.moves === 1 ){
        //console.log(this.state.moves, {m: m , o:o.size, x:x.size })
        return index = this.boxes[4] === 'E' ? 4 : 0;
      }else{
          console.log('--------------------------------')
          //get all winner options
          for(let i in this.winOptions){
              let config = this.winOptions[i];
              
              // validate x
              a = config.filter( i =>  !x.has(i));
              b = config.filter( i =>  !o.has(i));
              c = config.filter( i =>  !m.has(i));

              console.log(config, c.length)
              
               if(  c.length !== 0 && b.length === 1  ){                  
                  return index = b[0] - 1;
                  console.log('IA')
              }else{
                if(  c.length !== 0 && a.length === 1  ){                  
                    return index = a[0] - 1;
                    console.log('Player')
                }
              }             
          }         
      }
      
  }
  onTurn(e){     
    this.boxes[e.target.dataset.id] =  this.state.player;
    this.setTurn();
  }
  setTurn(){
    this.setState({
      player : this.state.player === 'O' ? 'X' : 'O',
      moves: this.state.moves + 1
    });
  }
  componentDidUpdate(props,state){
    if( this.state.player !== state.player && this.state.player === 'O' ){
      this.IA();
    }
  }
  render() {
    return (
      <div className="app">        
          <Board onTurn={this.onTurn.bind(this) } boxes={this.boxes} player={this.state.player} />
      </div>
    );
  }
}

export default App;
