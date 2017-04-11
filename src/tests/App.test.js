'use strict';

import React        from 'react';
import ReactDOM     from 'react-dom';
import renderer     from 'react-test-renderer';
import {shallow,mount}    from 'enzyme';
import sinon        from 'sinon';

//components
import App       from './App';
import TicTacToe from './TicTacToe';

describe("Testing Application", ()=> {

  it('should render <App /> component', () => {      
       const div = document.createElement('div');
        ReactDOM.render(<App />, div);
  });

  it('should render <TicTacToe /> component', () => {   
        const div = document.createElement('div');
        ReactDOM.render(<TicTacToe />, div);
  });

  it('should  <TicTacToe /> render board', () => {   
      sinon.spy(TicTacToe.prototype, 'componentDidMount');
      var w = mount(<TicTacToe />);
      expect(TicTacToe.prototype.componentDidMount.calledOnce).toEqual(true);

  });


})
   


