import styles from "./style";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Billing,
  Business,
  CardDeal,
  Clients,
  CTA,
  Footer,
  Navbar,
  Stats,
  Testimonials,
  Hero,
} from "./components";

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
    <div className="bg-primary w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Hero />
        </div>
      </div>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Stats />
          <Business />
          <Billing />
          <CardDeal />
          <Testimonials />
          <Clients />
          <CTA />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
