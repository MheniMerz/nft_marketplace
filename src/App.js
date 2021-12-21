import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

// Update with the contract address logged out to the CLI when it was deployed 
const greeter_address = "0xaD59b6811e3C1D4bF878a01e6339BD144319dd65"
const token_address = "0xAc918790609B9f9F92c3AdA8F0f7199558FFA29e"

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState('')
  const [user_account, setUserAccount] = useState('')
  const [amount, setAmount] = useState('')

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeter_address, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const[account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(token_address, Token.abi, provider);
      const balance = await contract.balance_of(account);
      console.log('balance: ', balance.toString())
    }    
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeter_address, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function sendCoin() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(token_address, Token.abi, signer)
      const transaction = await contract.transfer(user_account, amount)
      await transaction.wait()
      console.log(`${amount} Coins sent to ${user_account}`)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoin}>Send Coin</button>
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <input onChange={e => setUserAccount(e.target.value)} placeholder="User Account" />
      </header>
    </div>
  );
}

export default App;
