import React from 'react';
import ReactDom from 'react-dom';

const StorePicker = React.createClass({
  render() {
    return (
      <p>Hello</p>
    );
  },
});

ReactDom.render(<StorePicker />, document.querySelector('#main'));

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


