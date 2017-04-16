'use strict';

import React        from 'react';
import ReactDOM     from 'react-dom';
import renderer     from 'react-test-renderer';
import {shallow,mount}    from 'enzyme';
import sinon        from 'sinon';

//components
import App       from '../App';

describe("Testing Application", ()=> {

  it('should render <App /> component', () => {      
       const div = document.createElement('div');
        ReactDOM.render(<App />, div);
  });

  it('should render <App /> component', () => {   
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
  });

  it('should  <App /> render board', () => {   
      sinon.spy(App.prototype, 'IA');
      var w = mount(<App />);
      console.log( App.prototype.IA )
      //expect(App.prototype.componentDidUpdate.calledOnce).toEqual(true);

  });


})
   


