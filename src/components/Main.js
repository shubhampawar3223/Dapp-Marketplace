import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'reactstrap';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.nameRef = React.createRef();
        this.priceRef = React.createRef();
    }

    print= (event)=>{
        // console.log(this.nameRef.current.value);
        // console.log(this.priceRef.current.value);
        event.preventDefault();
       let _name=  this.nameRef.current.value;
       let _price= window.web3.utils.toWei(this.priceRef.current.value.toString(), 'Ether');
        this.props.createProduct(_name,_price)
    }

    
   // ={()=>this.props.createProduct(this.nameRef.current.value,window.web3.utils.toWei(this.priceRef.current.value.toString(), 'Ether'))}
     render(){
         console.log(this.props.products)
         return(
         <div className="container-fluid mt-5 pt-4">
            <div className="row">
            <div className="col-12">
               <h1>Add Product</h1>
               <form>
                 <div className="form-group col-6">
                    <input ref={this.nameRef} type="text" className="form-control" placeholder="Product Name"/>
                </div>                   
                <div className="form-group col-6">
                    <input ref={this.priceRef} type="text" className="form-control" placeholder="Product Price"/>

                    <button className="btn btn-primary mt-3" onClick={this.print}>Add Product</button>
                </div>

               </form>
            </div>
            
            <div className="col-12">
            <h1>Buy Product</h1> 
            <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>Owner</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {this.props.products.map((e,i)=>{
           return(   
            <tr key={i}>
              <th scope="row">{i+1}</th>
              <td>{e.name}</td>
              <td>{window.web3.utils.fromWei(e.price.toString())} Eth</td>
              <td>{e.owner}</td>
              <td>{!e.purchased ? 
              <button onClick={()=>this.props.purchaseProduct(i+1,e.price)} className="btn btn-secondary" >Buy </button>
              :null}
              </td>
              </tr>  
           )
        })  
     }
      </tbody>
    </Table>
            </div>
            </div>
         </div>
         )
     }
}

{/* <tr key={i}>
              <th scope="row">i</th>
              <td>{e}</td>
              </tr> */}