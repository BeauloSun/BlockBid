import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Notification />
      <Footer />
    </div>
  );
}

export default App;
