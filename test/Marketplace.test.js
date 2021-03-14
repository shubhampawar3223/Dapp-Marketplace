const { assert } = require("chai");
const { contracts_directory } = require("../truffle-config");

require('chai')
        .use(require('chai-as-promised'))
        .should()

const Marketplace = artifacts.require('./Marketplace.sol');

contract('Marketplace',([deployer, seller, buyer])=>{
  let marketplace;

  before(async ()=>{
    marketplace = await Marketplace.deployed();
  })

  describe('deployment',async()=>{
      it('deploys successfully',async()=>{
        const address = await marketplace.address
        assert.notEqual(address,0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })
     
      it('has a name',async ()=>{
        const name= await marketplace.name();
        assert.equal(name,'Dapp University Marketplace')
      })
  })

  describe('product ',async ()=>{
       let result,productCount; 
       
       before( async()=>{
          result = await marketplace.createProduct("iphone x", web3.utils.toWei('1','Ether'),{from: seller});
          productCount = await marketplace.productCount()
       })

      it('create product',async ()=>{
        assert.equal(productCount,1)
        const event = result.logs[0].args;
        assert.equal(event.name,'iphone x',"name is correct")
        assert.equal(event.id.toNumber(), productCount.toNumber(),"id is corect");
        assert.equal(event.price,'1000000000000000000',"price is correct")
        assert.equal(event.owner, seller," owner is correct")
        assert.equal(event.purchased, false,"purchased is correct")

        await await marketplace.createProduct("", web3.utils.toWei('1','Ether'),{from: seller}).should.be.rejected;
        await await marketplace.createProduct("iphone x", 0,{from: seller}).should.be.rejected;
      })
      
      it('list products',async ()=>{
        
        const productInfo = await marketplace.products(productCount)
        assert.equal(productInfo.name,'iphone x',"name is correct")
        assert.equal(productInfo.id.toNumber(), productCount.toNumber(),"id is corect");
        assert.equal(productInfo.price,'1000000000000000000',"price is correct")
        assert.equal(productInfo.owner, seller," owner is correct")
        assert.equal(productInfo.purchased, false,"purchased is correct") 
      })

      it('purchased check',async ()=>{
        let  oldSellerBalance = await web3.eth.getBalance(seller);
        oldSellerBalance = new web3.utils.BN(oldSellerBalance);
        const result = await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1','Ether') });
        const event = result.logs[0].args; 
        assert.equal(event.name,'iphone x',"name is correct");
        assert.equal(event.id.toNumber(),productCount,"id is corect");
        assert.equal(event.price,'1000000000000000000',"price is correct")
        assert.equal(event.owner, buyer," owner is correct")
        assert.equal(event.purchased, true,"purchased is correct"); 
        
        let newSellerBalance = await web3.eth.getBalance(seller);
        newSellerBalance = new web3.utils.BN(newSellerBalance);

        let price = web3.utils.toWei('1', 'Ether');
        price =  new web3.utils.BN(price);

      const expectedBalance = oldSellerBalance.add(price);
        assert.equal(expectedBalance.toString(),newSellerBalance.toString());
      })
  })

})