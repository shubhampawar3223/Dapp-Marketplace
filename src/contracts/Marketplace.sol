pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => product) public products;

    struct product{
     uint id;
     string name;
     uint price;
     address payable owner;
     bool purchased;
    }
   
    event productCreation(
      uint id,
     string name,
     uint price,
     address payable owner,
     bool purchased
    );
    
    event purchasedProduct(
     uint id,
     string name,
     uint price,
     address payable owner,
     bool purchased
    );

    constructor() public {
        name = "Dapp University Marketplace";
    }

    function createProduct(string memory _name, uint _price) public {
         //require(_name)
         require(bytes(_name).length > 0);
         require(_price > 0);
         productCount++;
         products[productCount] = product(productCount, _name, _price, msg.sender, false);
         emit productCreation(productCount, _name, _price, msg.sender, false);
    }
   
   function purchaseProduct(uint _id) public payable{
    product memory prod = products[_id];
    require(prod.id > 0 &&  prod.id <= productCount);
    require(msg.value >= prod.price);
    require(!prod.purchased);
    require(prod.owner != msg.sender);
    address payable _seller = prod.owner;
    address(_seller).transfer(msg.value);
    prod.owner = msg.sender;
    prod.purchased = true;
    products[_id] = prod; 
    emit purchasedProduct(prod.id, prod.name, prod.price, prod.owner, prod.purchased);
   }

}
