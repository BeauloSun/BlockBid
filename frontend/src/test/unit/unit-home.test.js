import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { Hero } from "../../components/Hero";
import { Footer } from "../../components/Footer";
import { Notification } from "../../components/Notification";

test("Navbar", () => {
  render(
    <Router>
      <Navbar />
    </Router>
  );
  const textElement = screen.getAllByText("Profile");
  expect(textElement).not.toBeNull();
});

test("Hero", () => {
  render(
    <Router>
      <Hero />
    </Router>
  );
  const textElement = screen.getAllByText("Third year project");
  expect(textElement).not.toBeNull();
});

test("Notification", () => {
  render(
    <Router>
      <Notification />
    </Router>
  );
  const textElement = screen.getAllByText("Notify Me");
  expect(textElement).not.toBeNull();
});

test("Footer", () => {
  render(
    <Router>
      <Footer />
    </Router>
  );
  const textElement = screen.getAllByText(
    "Copyright Ⓒ 2023 BlockBid. All Rights Reserved."
  );
  expect(textElement).not.toBeNull();
});
