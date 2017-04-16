import React from 'react';
import _ from 'lodash';


class Box extends React.Component {
  render() {
    if(this.props.loader ){
       if( this.props.empty === 'E'){
          return (
            <div className="box  box-wait"/>
          );
      }else{
        return (
            <div className="box box-wait" > 
              <label data-id={this.props.id}  >{this.props.empty} </label>          
            </div>
          )
      }
    }else{
      if( this.props.empty === 'E'){
        return (
          <div className="box" data-id={this.props.id} onClick={this.props.onTurn} ></div>
        );
      }else{
        return (
          <div className="box" > 
            <label data-id={this.props.id}  >{this.props.empty} </label>
          </div>
        );
      }
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

    //inital state
    this.state = {
        loader  :false,
        game    : true,
        player  :'X',
        moves   :0,
        boxes   :Array(9).fill('E')
    }

    //Available options for win
    this.winOptions  = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

    //local
    this.loader = false;
    this.boxes  = this.state.boxes;
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
    //var emptys = this.state.boxes.filter((v,i) => { return v === 'E' ? i : null });

    //set index
    let index = this.findMove(x,m,o);

    //set index occuped in board
    this.boxes[ index ] = 'O';
    
    //set the turn after assing slot   
    setTimeout(()=>{
      this.setTurn();
    },2000)
  }
  findMove(x,m,o){
      // set option win array
      let a;
      let b;
      let c;
      let index;
      let config;
      let options = [];

       x = new Set(x);      
       o = new Set(o);
       m = new Set(m);

      if(this.state.moves === 1 ){        
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
                    index = b[0] - 1;
                }
                if( typeof index === 'undefined' && a.length === 1  ){
                    index = a[0] - 1;
                }
                options.push(config);
              }
          }

          if(typeof index === 'undefined' ){        
            for( let u in options ){
              config = options[u];              
              index = this.boxes[config[0] - 1] === 'E' ? config[0] - 1 : config[2] - 1
            }    
          }
      }    
      return index;
  }
  onTurn(e){    
    this.boxes[e.target.dataset.id] =  this.state.player;    
    this.setTurn();
  }
  setTurn(){ 
    this.setState({
      player   : this.state.player === 'O' ? 'X' : 'O',
      moves    : this.state.moves + 1,
      boxes    : this.boxes,
      loader   : false,
      warnings : ''
    });
    this.checkWinner(); 
  }
  componentDidUpdate(props,state){

    this.boxes = this.state.boxes;    
    if( this.state.player !== state.player && this.state.player === 'O' ){      
      this.setState({loader:true, warnings:'Loading'})
      this.IA();
    }
    if(this.state.moves === 9 ){
      this.refs.warnings.innerHTML = 'Finised!';
    }
  }
  checkWinner(){
      var winConfigs  = this.winOptions;
      let a;
      let b;
      let c;
      let d;
      let config;
      let x = [];
      let o = [];
      let e = [];
      let m = [];

      this.boxes.map((v,i) => { if( v === 'X') { x.push(i+1) } });
      this.boxes.map((v,i) => { if( v === 'O') { o.push(i+1) } });
      this.boxes.map((v,i) => { if( v === 'E') { e.push(i+1) } });
      this.boxes.map((v,i) => { if( v !== 'E') { m.push(i+1) } });


       x = new Set(x);      
       o = new Set(o);
       m = new Set(m);


      for(let i in this.winOptions){
            // current win option row
             config = this.winOptions[i];              
              // validate player availabe options
             a = new Set( config.filter( i =>  !x.has(i)) );

              // validate IA  availabe options
             b = new Set( config.filter( i =>  !o.has(i)) );

              //validate total board
             c = config.filter( i =>  !a.has(i));
             d = config.filter( i =>  !b.has(i));
            
              if( c.length === 3 || d.length === 3){
                if( c.length === 3 ){
                  this.setState({game:false,warnings:'winner is X'})
                }
                if( d.length === 3){
                  this.setState({game:false,warnings:'winner is O'})
                }    


                return true;             
              }
          }
   
  }
  render() {
    return (
      <div className="app">        
          <Board onTurn={this.onTurn.bind(this) } game={this.state.game} loader={this.state.loader} boxes={this.state.boxes} player={this.state.player} />
          <div ref="warnings" className="warnings">{this.state.warnings}</div>
      </div>
    );
  }
}

export default App;