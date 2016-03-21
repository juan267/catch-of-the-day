import React from 'react';
import ReactDom from 'react-dom';


// App *******************
const App = React.createClass({
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header />
        </div>
        <Order />
        <Inventory />
      </div>
    );
  },
});

// end of App *******************

// Header ****************

const Header = React.createClass({
  render() {
    return (
      <p>Header</p>
    );
  },
});

// end of Header *********

// Order *****************
const Order = React.createClass({
  render() {
    return (
      <p>Order</p>
    );
  },
});

// end or Order **********

// Inventory **************

const Inventory = React.createClass({
  render(){
    return (
      <p>Invenotory</p>
    );
  },
});

// end of Inventory


// Story Picker *************

const StorePicker = React.createClass({
  render() {
    return (
      <form className="store-selector">
        <h2>Please enter a Store</h2>
        <input type="text" ref="storeId" />
        <input type="submit" />
      </form>
    );
  },
});

// end of Store Picker ***********

ReactDom.render(<App />, document.querySelector('#main'));

// ******** Using old ES5 **************
// var React = require('react')
// var ReactDom = require('react-dom')

// const StorePicker = React.createClass({
//   render: function(){
//     return (
//       <p>Hello</p>
//     )
//   }
// })
// ******** Using old ES5 **************
