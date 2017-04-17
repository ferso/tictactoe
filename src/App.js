import React from 'react';
import _ from 'lodash';

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

class Board extends React.Component {
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
  componentDidMount(){
    //this.AI();
  }
  componentDidUpdate(props,state){
    if( this.state.player !== state.player && this.state.player === 'O' ){      
      if(this.state.moves === 9 ){
        this.setState({ warnings:'DRAW!', game:false})
      }else{
        this.setState({loader:true, warnings:'COMPUTER TURN'})
        this.AI();
      }
    }
  }
  componentWillUpdate(props, state){
     if(state.player !== this.state.player){
      this.checkWinner();      
    }
  }
  AI(){ 
    
    let x = [];
    let o = [];
    let e = [];
    let m = [];

    this.state.boxes.forEach((v,i) => { if( v === 'X') { x.push(i+1) } });
    this.state.boxes.forEach((v,i) => { if( v === 'O') { o.push(i+1) } });
    this.state.boxes.forEach((v,i) => { if( v === 'E') { e.push(i+1) } });
    this.state.boxes.forEach((v,i) => { if( v !== 'E') { m.push(i+1) } });

    //set index
    let index = this.findMove(x,m,o);

    //the AI turn, set index action to board 
    setTimeout( ()=>{
       this.setTurn(index,'O');
    },500)    
  }
  onTurn(e){
    if(this.state.player === 'X'){
      this.setTurn(e.target.dataset.id,'X');
    }
  }
  setTurn(index,turn){
    if(this.state.game){
      this.state.boxes[index] = turn;
      let boxes = this.state.boxes;
          boxes[index] = turn;      
      this.setState({
        player   : this.state.player === 'O' ? 'X' : 'O',
        moves    : this.state.moves + 1,
        boxes    : boxes,
        loader   : false,
        warnings :'YOUR TURN'
      });
    }    
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

      if(this.state.moves <= 1 ){
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
                    index = b[0] - 1;
                }
                if( typeof index === 'undefined' && a.length === 1  ){
                    index = a[0] - 1;
                }
                options.push(config);
              }
          }
          // min max option 
          if(typeof index === 'undefined' ){        
            for( let u in options ){
              config = options[u];             
              if( this.state.boxes[config[0] - 1] === 'E' ){
                 return index = config[0] - 1;
              }else{                
                index = config[2] - 1;
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
      let x = [];
      let o = [];
      let e = [];
      let m = [];

      // definig current board slots
      this.state.boxes.forEach((v,i) => { if( v === 'X') { x.push(i+1) } });
      this.state.boxes.forEach((v,i) => { if( v === 'O') { o.push(i+1) } });
      this.state.boxes.forEach((v,i) => { if( v === 'E') { e.push(i+1) } });
      this.state.boxes.forEach((v,i) => { if( v !== 'E') { m.push(i+1) } });

      // transform to object references
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