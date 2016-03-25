import React from 'react';
import { render } from 'react-dom';

// Routing libraries
import { Router, Route, Link, browserHistory } from 'react-router';
import h from './helpers';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// const Router = ReactRouter.Router;
// const Route = ReactRouter.Route;
// const Navigation = ReactRouter.Navigation;


// App *******************
const App = React.createClass({
  getInitialState() {
    return {
      fishes: {},
      order: {},
    };
  },
  addFish(fish) {
    const timeStamp = (new Date()).getTime();
    this.state.fishes[`fish-${timeStamp}`] = fish;
    this.setState({ fishes: this.state.fishes });
  },
  addFishtoOrder(fish) {
    this.state.order[fish] = this.state.order[fish] += 1 || 1;
    this.setState({ order: this.state.order });
  },
  loadSamples() {
    this.setState({
      fishes: require('./sample-fishes'),
    });
  },
  renderFish(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addFishtoOrder={this.addFishtoOrder} />;
  },
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh sea food market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    );
  },
});

// end of App *******************

const Fish = React.createClass({
  onButtonOrder() {
    console.log(`Adding fish ${this.props.index}`);
    this.props.addFishtoOrder(this.props.index);
  },
  render() {
    const details = this.props.details;
    const isAvailable = (details.status === 'available');
    const buttonText = isAvailable ? 'Add to Order' : 'Sold Out!';
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonOrder}>{buttonText}</button>
      </li>
    );
  },
});
// Header ****************

const Header = React.createClass({
  render() {
    return (
      <header className="top">
        <h1>
          Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
          Day
        </h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3>
      </header>
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
  render() {
    return (
      <div>
        <p>Inventory</p>
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples} >Load Samples!</button>
      </div>
    );
  },
});

// Create fish Form

const AddFishForm = React.createClass({
  createFish(event) {
    event.preventDefault();
   // console.log(this.refs.name.value); This works with the constructor object of the component and the refs attributes of the input and not the event
   // console.log(event.target.name.value); This works with the event target and the name attribute of the input

    const fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value,
    };

    this.props.addFish(fish);
    this.refs.fishForm.reset();
  },
  render() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" name="name" ref="name" placeholder="Fish Name" />
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="Url to Image" />
        <button type="submit">+ Add Item</button>
      </form>
    );
  },
});

// end of Inventory


// Story Picker *************

const StorePicker = React.createClass({
  goToStore(event) {
    event.preventDefault();
    const storeId = this.refs.storeId.value;
    // console.log(this.refs); // This gets all the DomObjects with ref names
    // console.log(storeId); // The value in the input box
    browserHistory.push(`/store/${storeId}`);
  },
  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please enter a Store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} />
        <input type="submit" />
      </form>
    );
  },
});

// end of Store Picker ***********

const NotFound = React.createClass({
  render() {
    return (
      <h1>Not Found!</h1>
    );
  },
});


/*
  Routes
*/

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={StorePicker} />
    <Route name="storeDetail" path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);


render(routes, document.querySelector('#main'));


// ******** Using old ES5 **************
// var React = require('react')
// var ReactDom = require('react-dom')

// var StorePicker = React.createClass({
//   render: function(){
//     return (
//       <p>Hello</p>
//     )
//   }
// })
// ******** Using old ES5 **************
