
import { Injectable } from '@angular/core';
import Web3 from 'web3';
// const Web3 = require('web3');
declare let require: any;
declare let window: any;
const tokenAbi = require('../../../truffle/build/contracts/Transfer.json');

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  
  private account: any = null;
  private readonly web3: any;
  private enable: any;
  private smartContract: any;
  
  constructor() {
    console.log("tokenAbi ", tokenAbi);
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask'); 
    } 
    else {
      if (typeof window.web3 !== 'undefined') { 
        this.web3 = window.web3.currentProvider;
      } else { 
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545'); 
      }
      console.log('transfer.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum); 
      console.log('transfer.service :: constructor :: this.web3'); console.log(this.web3);
      this.enable = this.enableMetaMaskAccount();
      console.log("window_web3_eth", window.web3.eth);


    } 
  }

  async testResult(){
    let result = await window.web3.eth.getBalance("0x34FE22F0DA462eb29fADac03B9309e7A0E532aA6").toPromise()
      console.log(result);
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  public getUserAccountAndBalance() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getAccounts().then((accounts:any)=>{
        console.log("accounts ", accounts);
        this.account = accounts[0];
        window.web3.eth.getBalance(accounts[0]).then((balance:any)=>{
          console.log(balance);
          const retVal = {
            account: accounts[0],
            balance: balance
          };
          resolve(retVal);
        }).catch((err: any)=>{
          console.log(err);
          reject(err);
        }); 
      }).catch((err:any)=>{
        console.log(err);
        reject(err);
      });
  }) as Promise<any>;
  }

  // public getAccounts(){
  //   return new Promise((resolve, reject) => {
  //     console.log('transfer.service :: getAccount :: eth');
  //     console.log("window_web3_eth", window.web3.eth);
  //     window.web3.eth.getAccounts((err: any, retAccount: any) => {
  //       console.log('transfer.service :: getAccount: retAccount');
  //       console.log(retAccount);
  //       if (retAccount.length > 0) {
  //         this.account = retAccount[0];
  //         resolve(this.account);
  //       } else {
  //         alert('transfer.service :: getAccount :: no accounts found.');
  //         reject('No accounts found.');
  //       }
  //       if (err != null) {
  //         alert('transfer.service :: getAccount :: error retrieving account');
  //         reject('Error retrieving account');
  //       }
  //     });
  //   }) as Promise<any>;
  // }

  // public async getUserBalance(): Promise<any> {
  //   //const account = await this.getAccount();
  //   console.log('transfer.service :: getUserBalance :: account');
  //   console.log(account);
  //   return new Promise((resolve, reject) => {
  //     window.web3.eth.getBalance(account, function(err: any, balance: any) {
  //       console.log('transfer.service :: getUserBalance :: getBalance');
  //       console.log(balance);
  //       if (!err) {
  //         const retVal = {
  //           account: account,
  //           balance: balance
  //         };
  //         console.log('transfer.service :: getUserBalance :: getBalance :: retVal');
  //         console.log(retVal);
  //         resolve(retVal);
  //       } else {
  //         reject({account: 'error', balance: 0});
  //       }
  //     });
  //   }) as Promise<any>;
  // }

  transferEther(value: any) {
    const that = this;
    console.log('transfer.service :: transferEther to: ' +
      value.transferAddress + ', from: ' + that.account + ', amount: ' + value.amount);
    return new Promise((resolve, reject) => {
      // console.log('transfer.service :: transferEther :: tokenAbi');
      // console.log(tokenAbi);

      // let smartContract = new window.web3.eth.Contract(tokenAbi, that.account);
      // console.log(smartContract);
      // const contract = require('@truffle/contract');
      // const transferContract = contract(tokenAbi);
      // transferContract.setProvider(that.web3);
      // console.log('transfer.service :: transferEther :: transferContract');
      // console.log(transferContract);
      console.log('transfer.service :: transferEther :: tokenAbi'); 
      console.log(tokenAbi);
      let contract: any;
      let transferContract: any;
      try {
         contract = require('@truffle/contract');
          transferContract = contract(tokenAbi);
      } catch (error) {
        console.log(error);
      }
       
      transferContract.setProvider(that.web3); 
      console.log('transfer.service :: transferEther ::transferContract');
      console.log(transferContract);
      transferContract.deployed().then(function(instance: any) {
        return instance.pay(value.transferAddress,{from: that.account, value: value.amount});
      }).then(function(status: any) {
        if (status) {
          return resolve({status: true});
        }
      }).catch(function(error: any) {
        console.log(error);
        return reject('transfer.service error');
      });
    });
  }

  transferEtherTest(value: any) {
    const that = this;
    console.log('transfer.service :: transferEther to: ' +
      value.transferAddress + ', from: ' + that.account + ', amount: ' + value.amount);
    console.log('transfer.service :: transferEther :: tokenAbi'); 
    console.log(tokenAbi);
    let contract: any;
    let transferContract: any;
    try {
        contract = require('@truffle/contract');
        transferContract = contract(tokenAbi);
    } catch (error) {
      console.log(error);
    }
      
    transferContract.setProvider(that.web3); 
    console.log('transfer.service :: transferEther ::transferContract');
    console.log(transferContract);
    transferContract.deployed().then(function(instance: any) {
      return instance.pay(value.transferAddress,{from: that.account, value: value.amount});
    }).then(function(status: any) {
      console.log(status);
    }).catch(function(error: any) {
      console.log(error);
    });
  }

  transferEtherTest2(value: any) {
    const that = this;
    try {
      let smartContract = new this.web3.eth.contract(tokenAbi, that.account);
      console.log(smartContract);
    } catch (error) {
      console.log(error);
    }
     
  }

}
