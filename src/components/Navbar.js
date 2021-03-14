import React, { Component } from 'react';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json'
import './App.css';

class Navbar extends Component {
  render() {

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <p className="navbar-brand col-sm-3 col-md-2 mr-0 k">
                Marketplace
          </p>
          <p className="text-white pr-3">Acc. Address: {this.props.account}</p>  
        </nav>
      </div>
    );
  }
}

export default Navbar;
