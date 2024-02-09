import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import { Holding } from "../../components/holdings";

test("Profile button", () => {
  render(
    <Router>
      <Holding />
    </Router>
  );
  const testElement = screen.getByRole("button", {
    name: "Profile & Security",
  });
  expect(testElement).toBeInTheDocument();
});

test("Holding button", () => {
  render(
    <Router>
      <Holding />
    </Router>
  );
  const testElement = screen.getByRole("button", {
    name: "Holdings",
  });
  expect(testElement).toBeInTheDocument();
});

test("Wallet Button", () => {
  render(
    <Router>
      <Holding />
    </Router>
  );
  const testElement = screen.getByRole("button", {
    name: "Wallet",
  });
  expect(testElement).toBeInTheDocument();
});
