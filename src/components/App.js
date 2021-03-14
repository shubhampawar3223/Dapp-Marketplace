import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json'
import './App.css';
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    this.loadBlockchainData();
  }
  

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert("Non ethereum browser detected,Consider trying Metamask");
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account:accounts[0]})
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId] 
    const abi = Marketplace.abi;
    if(networkData){
    const marketplace = web3.eth.Contract(abi, networkData.address);
    this.setState({marketplace:marketplace});
    const productCount= await marketplace.methods.productCount().call();

    for(let i=1;i <= +productCount.toString();i++){
     const k = await marketplace.methods.products(i).call();
     this.setState({
       products:[...this.state.products,k]
     })
    }
    this.setState({loading:false});
    }
    else{
      alert("smart contract is not deployed");
    }
  }


  
  constructor(props){
     super(props);
     this.state={
       account:'',
       productCount:0,
       products:[],
       loading:true
     }
     this.createProduct = this.createProduct.bind(this);
     this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  createProduct(name,price){
      this.setState({loading:true});
      this.state.marketplace.methods.createProduct(name,price).send({from:this.state.account})
      .once('receipt',(receipt)=>{
        this.setState({loading:false});        
      })
  }

  purchaseProduct(id,price){
   //console.log(id);
   this.setState({loading:true});
   this.state.marketplace.methods.purchaseProduct(id).send( {from:this.state.account, value:price})
   .then((receipt) => {
     console.log(receipt)
    this.setState({loading:false});
   })
  
  }

  render() {
    //createProduct={this.createProduct}
    return (
      <div>
      <Navbar account={this.state.account}/>
      {this.state.loading ? 
      <p className="mt-5">Loading</p>
      :<Main
      createProduct={this.createProduct}
       products={this.state.products} 
       purchaseProduct= {this.purchaseProduct}
      />}      
      </div>
    );
}
}

export default App;
