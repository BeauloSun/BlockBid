import { useEffect, useState } from "react";
import { Navbar } from "./components";
import "./App.css";
import axios from "axios";

function App() {
  const [nfts, addNfts] = useState([]);
  const [name, setName] = useState([]);
  const [owner, setOwner] = useState([]);
  const [price, setPrice] = useState([]);
  const [token, setToken] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getNfts")
      .then((nfts) => {
        addNfts(nfts.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const submit = () => {
    axios
      .post("http://localhost:5000/addNfts", {
        token,
        owner,
        price,
        name,
      })
      .then((nfts) => {
        console.log(nfts);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Navbar />
      {nfts.map((nft) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <div>
            <h3>Name: {nft.name}</h3>
            <h3>Owner: {nft.owner}</h3>
            <h3>Price: {nft.price}</h3>
          </div>
        );
      })}
      <br />
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Owner"
        onChange={(e) => setOwner(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Price"
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Token"
        onChange={(e) => setToken(e.target.value)}
      />
      <br />
      <button onClick={submit}>Add NFT</button>
    </div>
  );
}

export default App;
