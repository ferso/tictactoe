/* Copyright (C) Fernando Soto, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by @ferso <erickfernando@gmail.com>, April 10 2017
 */

/*eslint no-loop-func: "off"*/

import React from 'react';
import _     from 'lodash';
import Board from './components/Board';

class App extends React.Component {
  constructor(props,context){
    super(props,context);
    //initial state
    this.state = this.init();

    //Available options for win
    this.winOptions  = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
  }

  init(){
    return {
        loader  :false,
        game    :true,
        row     :false,
        player  :'X',
        moves   :0,
        boxes   :Array(9).fill('E'),
        warnings:'PLAYER START',
    }
  }  
  componentDidUpdate(props,state){
    
    if( this.state.player !== state.player && this.state.player === 'O' ){
      if(this.state.moves === 9 ){
        this.setState({ warnings:'DRAW!', game:false})
      }else{
        this.setState({ loader:true})
        this.AI();
      }
    }
  }
  componentWillUpdate(props, state){
     if(state.player !== this.state.player){
      this.checkWinner();      
    }
  }
  resolvePositions(){

    let x = [];
    let o = [];
    let e = [];
    let m = [];

    this.state.boxes.forEach((v,i) => { if( v === 'X') { x.push(i+1) } });
    this.state.boxes.forEach((v,i) => { if( v === 'O') { o.push(i+1) } });
    this.state.boxes.forEach((v,i) => { if( v === 'E') { e.push(i+1) } });
    this.state.boxes.forEach((v,i) => { if( v !== 'E') { m.push(i+1) } });
    return {x,o,e,m};
  }
  AI(){ 
   
    //set index
    let index = this.findMove();

    //the AI turn, set index action to board 
    setTimeout( ()=>{
       this.setTurn(index,'O');
    },600)    
  }
  onTurn(e){
    if(this.state.player === 'X'){
      this.setTurn(e.target.dataset.id,'X');
    }
  }
  setTurn(index){
    if(this.state.game){
      let boxes = this.state.boxes;
          boxes[index] = this.state.player;      
      this.setState({
        player   : this.state.player === 'O' ? 'X' : 'O',
        moves    : this.state.moves + 1,
        boxes    : boxes,
        loader   : false,
        warnings : this.state.player === 'O' ? 'YOUR TURN' : 'COMPUTER TURN'
      });
    }    
  }
  findMove(){
    
      // set option win array
      let a;
      let b;
      let c;
      let index;
      let config;
      let options = [];

      let {x,o,m,e} = this.resolvePositions();
      
       x = new Set(x);      
       o = new Set(o);
       m = new Set(m);

      if(this.state.moves === 1 ){
         //var rand = Math.floor(Math.random() * 8) + 1            
         index = this.state.boxes[4] === 'E' ? 4 : 0;
      }else{
          //get all winner options
          for(let i in this.winOptions){
            // current win option row
             config = this.winOptions[i];              
              // validate player availabe options
              a = config.filter( i =>  !x.has(i));

              // validate IA  availabe options
              b = config.filter( i =>  !o.has(i));  

              //validate total board
              c = config.filter( i =>  !m.has(i));
              

              if(c.length !== 0){
                if(  b.length === 1  ){
                    console.log('b')
                    index = b[0] - 1;
                }
                if(  a.length === 1  ){
                    console.log('a')
                    index = a[0] - 1;
                }
                options.push(config);
              }
          }
          // min max option 
          if(typeof index === 'undefined' ){ 

              console.log('entra a acá')
              if( this.state.boxes[0] === 'X' && this.state.boxes[8] === 'X' && this.state.boxes[4] === 'O' && this.state.boxes[3] === 'E' ){
                index = 3;
                return index;
              }

              if( this.state.boxes[2] === 'X' && this.state.boxes[6] === 'X'  && this.state.boxes[4] === 'O' && this.state.boxes[5] === 'E'  ){
                index = 5;
                return index;
              }
              
            

            for( let u in options ){
              config = options[u];
              
              if( this.state.boxes[config[0] - 1] === 'E' ){                
                 index = config[0] - 1;
                 return index;
              }else{                                
                index = config[1] - 1;
              
                 return index;
              }
            }    
          }
      }    
      return index;
  }
  checkWinner(){   
      let a;
      let b;
      let c;
      let d;
      let config;
    
      // define statuses 
      let {x,o} = this.resolvePositions();

      // transform to object references
      x = new Set(x);      
      o = new Set(o);
    
      for(let i in this.winOptions){

        // current win option row
        config = this.winOptions[i];              
        // validate player availabe options
        a = new Set( config.filter( i =>  !x.has(i)) );

        // validate IA  availabe options
        b = new Set( config.filter( i =>  !o.has(i)) );

        //validate total board
        c = config.filter( i =>  !a.has(i)  );
        d = config.filter( i =>  !b.has(i) );
        
        //define winner
        if( c.length === 3 || d.length === 3){
          if( c.length === 3 ){
            this.setState({game:false,warnings:'PLAYER WIN',row:c})
          }
          if( d.length === 3){
            this.setState({game:false,warnings:'AI WIN!',row:d})
          }
          return true;
        }
    }   
  }
  restart(){    
    this.setState(this.init())
  }
  render() {
    return (
      <div className="app">               
          <Board restart={this.restart.bind(this)} moves={this.state.moves} row={this.state.row} warnings={this.state.warnings} onTurn={this.onTurn.bind(this) } game={this.state.game} loader={this.state.loader} boxes={this.state.boxes} player={this.state.player} />
      </div>
    );
  }
}

export default App;