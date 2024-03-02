"use client";
import styles from "./page.module.css";
import React, { Component } from "react";
import { ethers } from "ethers";
import Pooll from "../artifacts/contracts/Pool.sol/Pool.json";
import ERC200 from "../artifacts/contracts/ERC20.sol/ERC20.json";
import { Pool__factory, ERC20__factory, ERC20, Pool, } from "../typechain-types";

interface IState{
    token: string;
    outputValue: string;
    reserveIn: number;
    reserveOut: number;
    contract: Pool;
    Token1Contract: ERC20;
    Token2Contract: ERC20;
    Provider: string;
    contractAddress: string;
    Token1Address: string;
    Token2Address: string;
}

class CampaignIndex extends Component {
  state = {
    token: "",
    outputValue: "",
    reserveIn: 0,
    reserveOut: 0,
    Provider: "",
    contractAddress: "0x101aA514319aD89260e33035fabaEe042f15B0d5",
    Token1Address: "0x1928496a8E34967F02eAF527Fe8A4EaC2EA8E646",
    Token2Address: "0x84933aD21c5e47d390061877ad7B149e042dB983",
  } as IState;

  async componentDidMount() {
    const provider = new ethers.BrowserProvider(window.ethereum);

    if (provider) {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      //setAccount(address);
      // const contractAddress = "0xcC680Ce60E640F8BEF955AC5fDe00F4700DC97D3";
      console.log(provider);
      const contract = new ethers.Contract(
        this.state.contractAddress,
        Pooll.abi,
        signer
      );
      const Token1Contract = new ethers.Contract(
        this.state.Token1Address,
        ERC200.abi,
        signer
      );
      const Token2Contract = new ethers.Contract(
        this.state.Token2Address,
        ERC200.abi,
        signer
      );
      //this.setState.contract=contract;
      this.setState({
        contract: contract,
      });
      this.setState({
        Token1Contract: Token1Contract,
      });
      this.setState({
        Token2Contract: Token2Contract,
      });
      console.log("line11");
      this.setState({
        Provider: signer,
      });
      // this.setState.Token1Contract=Token1Contract;
      // this.setState.Token2Contract=Token2Contract;
      // this.setState.Provider=signer;
      this.setState({
        reserveOut: await contract.reserve1(),
      });
      this.setState({
        reserveIn: await contract.reserve0(),
      });
      
      // this.setState.reserveOut = await contract.reserve1();
      // console.log("line1", this.state.reserveIn);
      //   console.log("line2", this.state.reserveOut);

    } else {
      alert("Metamask is not installed.");
    }

    // this.setState({
    //   reserveIn: await contract.reserve0()
    // });
    // this.setState({
    //   reserveOut: await contract.reserve1()
    // });
    // this.setState.reserveOut = await contract.reserve1();
    // console.log("line1", parseInt(this.state.reserveIn));
    // console.log("line2", parseInt(this.state.reserveOut));
  }
  onSubmit = async (event : React.MouseEvent<HTMLElement>) => {
    console.log(this.state.contract);
    event.preventDefault();
    const approve = await this.state.Token2Contract.approve(
      this.state.contractAddress,
      this.state.token
    );
    await approve.wait();
    const swap = await this.state.contract.swap(
      this.state.Token2Address,
      this.state.token
    );
    await swap.wait();
  };

  /* static async getIntialProps(){

      onSubmit=async (event)=>{
           event.preventDefault();

           const accounts=await web3.eth.getAccounts();
           await factory.methods.swap(this.state.token)
           .send({
               from : accounts[0]
           });
      };
   }*/
  render() {
    return (
      <div className={styles.full}>
        <div className={styles.header}>
          <h2 className={styles.header2}>UTTAM SWAP</h2>
        </div>
        <div className={styles.top}>
          <div className={styles.box}>
            <div className={styles.token1}>Token 2</div>
            <input
              type="number"
              className={styles.input1}
              placeholder="0"
              value={this.state.token}
              onChange={(event) =>
                this.setState({
                  token: event.target.value,
                  outputValue:
                    (Number(this.state.reserveOut) * Number(event.target.value) * 1.13) / Number(this.state.reserveIn),
                })
              }
            />
            <div className={styles.token1}>Token 1</div>
            <div className={styles.buttondiv}>
              <input
                type="number"
                className={styles.input2}
                placeholder="0"
                value={this.state.outputValue}
                readOnly
              />
              <div>
                <button className={styles.button} onClick={this.onSubmit}>
                  Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignIndex;
