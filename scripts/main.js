import React from 'react';
import { render } from 'react-dom';
import CSSTransitionGroup  from 'react-addons-css-transition-group';
// Routing libraries
import { Router, Route, Link, browserHistory } from 'react-router';
import h from './helpers';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// const Router = ReactRouter.Router;
// const Route = ReactRouter.Route;
// const Navigation = ReactRouter.Navigation;

// Firebase

import Rebase from 're-base';

import Catalyst from 'react-catalyst';

const Base = Rebase.createClass('https://juan-catch-of-day.firebaseio.com/');


// App *******************
const App = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  getInitialState() {
    return {
      fishes: {},
      order: {},
    };
  },
  componentDidMount() {
    Base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes',
    });

    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef),
      });
    }
  },
  componentWillUpdate(nextProps, nextState) {
    console.log(nextState)
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  },
  addFish(fish) {
    const timeStamp = (new Date()).getTime();
    this.state.fishes[`fish-${timeStamp}`] = fish;
    this.setState({ fishes: this.state.fishes });
  },
  removeFish(fish) {
    console.log(fish);
    this.state.fishes[fish] = null;
    this.setState({
      fishes: this.state.fishes,
    });
  },
  addFishtoOrder(fish) {
    this.state.order[fish] = this.state.order[fish] + 1 || 1;
    this.setState({ order: this.state.order });
  },
  removeFishFromOrder(fish) {
    delete this.state.order[fish];
    this.setState({
      order: this.state.order,
    });
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
        <Order fishes={this.state.fishes} order={this.state.order} removeFishFromOrder={this.removeFishFromOrder} />
        <Inventory addFish={this.addFish} fishes={this.state.fishes} loadSamples={this.loadSamples} linkState={this.linkState} removeFish={this.removeFish} />
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
  renderOrder(key) {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];

    if (!fish) {
      return (
        <li key={key}>Sorry, Fish no longer available!
        <button onClick={() => this.props.removeFishFromOrder(key)}>X</button></li>
      );
    }

    return (
      <li key={key}>
      {count}lbs of
      {fish.name}
      <span className="price">
        {h.formatPrice(fish.price * count)}
      </span>
      <button onClick={() => this.props.removeFishFromOrder(key)}>X</button>
      </li>
    );
  },
  render() {
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      var isAvailable = fish && fish.status === "available";

      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);
    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeour={500}
          transitionLeaveTimeout={500}
        >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    );
  },
});

// end or Order **********

<ul>
  <div className="right">
    <li>angie vanegas</li>
    <li>web development</li>
  </div>
  <div className="left">
    <li><a href="#"><i></i></a></li>
    // Todos los iconos de solian
  </div>
</ul>

// Inventory **************

const Inventory = React.createClass({
  renderFish(key) {
    const linkState = this.props.linkState;
    const status = this.props.fishes[key].status;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState(`fishes.${key}.name`)} />
        <input type="text" valueLink={linkState(`fishes.${key}.price`)} />
        <select valueLink={linkState(`fishes.${key}.status`)}>
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <input type="text" valueLink={linkState(`fishes.${key}.image`)} />
        <textarea valueLink={linkState(`fishes.${key}.desc`)} />
        <button onClick={() => this.props.removeFish(key)} key={key}>Remove Fish!</button>
      </div>
    );
  },
  render() {
    return (
      <div>
        <p>Inventory</p>
        {Object.keys(this.props.fishes).map(this.renderFish)}
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
