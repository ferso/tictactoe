/* Copyright (C) Fernando Soto, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by @ferso <erickfernando@gmail.com>, April 10 2017
 */


'use strict';

import React        from 'react';
import ReactDOM     from 'react-dom';
import {shallow,mount}    from 'enzyme';
import sinon        from 'sinon';

//components
import App       from '../App';
import Board     from '../components/Board';

jest.useFakeTimers()

describe("Test Game Application", ()=> {
  
  //mount the app
  const app   = shallow( <App /> );        

  it('should render <App /> component', () => {               
        expect(app.state().game).toBe(true);        
  });

    it('should render <Board /> component', () => {                       
        expect(  app.find('<Board />') ).toBeDefined()
  });

  it("should IA always WIN, wining with [ 4, 5, 6 ] method ", () => {           
           // player start
      app.instance().setTurn(0);
      
      //Computer Thinking
      jest.runAllTimers();
      
      //player next movement
      app.instance().setTurn(6);
      //Computer Thinking
      jest.runAllTimers();

      //player next movement
      app.instance().setTurn(7);

      //Computer Thinking
      jest.runAllTimers();

      //Game is Over
      expect(app.state().game).toBe(false);
      expect(app.state().row).toEqual([4,5,6]);
      
  });


  it("should Game Draw  ", () => {           
     
     //mount the app
     const app   = shallow( <App /> );

      //player start
      app.instance().setTurn(4);
      
      //Computer Thinking
      jest.runAllTimers();
      
      //player next movement
      app.instance().setTurn(2);

      //Computer Thinking
      jest.runAllTimers();

      //player next movement
      app.instance().setTurn(3);

      //Computer Thinking
      jest.runAllTimers();

      //player next movement
      app.instance().setTurn(1);

      //Computer Thinking
      jest.runAllTimers();

       //player next movement
      app.instance().setTurn(8);
      
       //Computer Thinking
      jest.runAllTimers();
      
      //Game is Over, DRAW
      expect(app.state().warnings).toBe('DRAW!');
      expect(app.state().game).toBe(false);
      
  });


  it("should IA always WIN, wining with [ 3, 5, 7 ] method ", () => {           
     
     //mount the app
     const app   = shallow( <App /> );

      // player start
      app.instance().setTurn(8);
      
      //Computer Thinking
      jest.runAllTimers();
      
      //player next movement
      app.instance().setTurn(7);
      //Computer Thinking
      jest.runAllTimers();

      //player next movement
      app.instance().setTurn(5);

      //Computer Thinking
      jest.runAllTimers();

      //Game is Over, IA WIN 
      expect(app.state().game).toBe(false);
      expect(app.state().row).toEqual([ 3, 5, 7 ]);
      
  });

  it('should restart the game ', () => {           
      
      //mount the app
      const app   = shallow( <App /> );

      // move from player
      app.instance().setTurn(5);

       // computer Thinking
      jest.runAllTimers();

      // move from player
      app.instance().setTurn(7);

      // validating current moves
      expect(app.state().boxes).toEqual([ 'E', 'E', 'E', 'E', 'O', 'X', 'E', 'X', 'E' ]); 

      // restart the game baby!
      app.instance().restart();
      
      // expect game is restarted
      expect(app.state().boxes).toEqual([ 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E' ]);
      
  });

})