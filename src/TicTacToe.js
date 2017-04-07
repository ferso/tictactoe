import React from 'react';
import _ from 'lodash';

import './App.css';

class TicTacToe extends React.Component {
  constructor(){
    super()         
      this.elements = [];
      this.state = { btn:'Restart Game', loader:true}
  }
  componentDidMount(){
    
    setTimeout(() =>{
      this.setState({loader:'false'})
      this.start();
    },1000)  
  }

  start(){
    
    this.cvn        = this.refs.board;
    this.ctx        = this.cvn.getContext("2d");
    this.cvn.width  = window.innerWidth;
    this.cvn.height = window.innerHeight;  

    this.step     = 0;
    this.game     = true;
    this.turn     = 'X';

    //drawTitle
    this.drawTitle();

    //drawTurn
    this.drawTurn();

    //start drawBoard
    this.drawBoard();

  }
  drawTitle(){
    let text               = 'TIC TAC TOE BOARD';
    this.ctx.font          = "40pt 'Cabin' , sans-serif"; 
    this.ctx.fillStyle     = '#5D4037';
    let tw                 = this.ctx.measureText(text).width;            
    this.ctx.fillText(text, (this.ctx.canvas.width/2) - tw/2 , 100 );    
  }

  drawTurn(){
    let text               = 'PLAYER TURN: ' + this.turn;
    this.ctx.font      = "20pt 'Cabin', sans-serif";  
    this.ctx.fillStyle = '#5D4037';
    let tw                 = this.ctx.measureText(text).width;
    this.ctx.clearRect( 0, 470, this.ctx.canvas.width,  40 ); 
    this.ctx.fillText(text, ( this.ctx.canvas.width /2)  - tw/2  , 500 );    
  }
  drawBoard(){

        let width  = 100;
        let height = 100;
        let iposx  =  ( this.ctx.canvas.width /2) - (width * 2.5);
        let iposy  =  40;
        let cols   = 9;
        let c      = 1;
        let r      = 1;
        let margin = 3;
        let fsize  = 30;
        for(let i=0; i < cols; i++){
          let iter = i + 1;
          let posx = iposx +( c * (width  + margin) );
          let posy = iposy + (r * (height + margin));
          if( c === 3 ){
              r++;
              c = 0;
          }
          // Add element.
          this.elements[i] = {
              colour: '#80CBC4',
              width: width,
              height: height,
              top: posy,
              content : iter,
              iter : iter,
              left: posx,
              fsize : fsize,
              enable:true,
              id: i
          }
        c++;
      }

      this.ctx.fillStyle = '#fff';    
      this.ctx.fillRect(iposx+104, 143, 304, 305);


      // Render elements.
      this.elements.forEach(element =>{
        this.drawBox(element);
      })

      // Enable Actions
      this.actionBox();
  }
  drawBox(el,ne={}){

    let element = Object.assign({},el,ne)    
    this.ctx.fillStyle = element.colour;    
    this.ctx.fillRect(element.left, element.top, element.width, element.height); 
    this.ctx.font      = "40pt 'Cabin' , sans-serif"; 
    this.ctx.fillStyle = '#4E342E';    
    this.ctx.fillText(element.content, element.left + (element.width/2) - (element.fsize/2) , element.top+(element.height/2) + (element.fsize/2) );    
  }  
  actionBox(){

      //Add event listener for `click` events.
      this.cvn.addEventListener('click', (event) => {
         let x = event.pageX - this.cvn.offsetLeft;
         let y = event.pageY - this.cvn.offsetTop;

          // Collision detection between clicked offset and element.
          this.elements.forEach( (element) => {
              if (y > element.top && y < element.top + element.height 
                  && x > element.left && x < element.left + element.width && element.enable ) {
                    
                   if( this.game ){
                      this.step++;
                      this.drawBox(element,{content:this.turn})                    
                      this.elements[element.id].enable  = false;
                      this.elements[element.id].content = this.turn;
                      this.checkWiner();                      
                      if( this.game){
                      this.turn = this.turn === 'X' ? 'O' : 'X';
                      this.drawTurn();
                    }
                  }                      
              }
          });
      }, false);
  }

  checkWiner(){ 
    
      var winConfigs  = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];     
     
      var players = {X:[],O:[]}
      for( let x in this.elements){        
          if(this.elements[x].content === 'X'){
              players.X.push(this.elements[x].iter);      
          }

           if(this.elements[x].content === 'O'){
              players.O.push(this.elements[x].iter);      
          }
      }
    
       winConfigs.map(config =>{
          if(typeof(config) === 'object' ){
            let a = new Set(config);
            let c = new Set(players[this.turn]);
            let diff = new Set( [...a].filter(x => !c.has(x)) );
            if( _.isEmpty(diff)  ){
                this.game = false;
                this.drawWiner(config)
            }
          }
      })

      if( this.step === 9 && this.game === true ){  
         this.game = false;      
         this.drawGameOver();
      }
 
  }

 drawWiner(line){
    let text               = 'WINNER IS : ' + this.turn;
    this.ctx.font      = "20pt 'Cabin', sans-serif";  
    this.ctx.fillStyle = '#00695C';
    let tw                 = this.ctx.measureText(text).width;
    this.ctx.clearRect( 0, 470, this.ctx.canvas.width,  60 ); 
    this.ctx.fillText(text, (this.ctx.canvas.width/2) - tw/2 , 500 );

    this.elements.map(e=>{
      if( line.indexOf( e.iter ) > -1 ){
        this.drawBox(e,{colour: '#009688', text:'#fff' });
       }
    })    
  }

  drawGameOver(){     
    let text               = 'GAME OVER';
    this.ctx.font      = "20pt 'Cabin', sans-serif";  
    this.ctx.fillStyle = 'red';
    let tw                 = this.ctx.measureText(text).width;    
    this.ctx.clearRect( 0, 470, this.ctx.canvas.width,  60 ); 
    this.ctx.fillText(text, (this.ctx.canvas.width/2) - tw/2 , 500 );        
  }
 restart(){
    this.ctx.clearRect(0, 0, this.cvn.width, this.cvn.height);
    this.start();
    this.setState({btn:'Restart Game'})
  }
  render() {
    return (
      <div className="game"> 
        <div className="controls">
          <button className="button" onClick={this.restart.bind(this)}>{this.state.btn}</button>
        </div>
          <canvas ref="board" width="100%" height="100%" className="board" />        
      </div>
    );
  }
}

export default TicTacToe;