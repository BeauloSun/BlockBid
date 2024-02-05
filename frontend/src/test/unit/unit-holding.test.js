import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Holding } from "../../components/holdings";
import { expect } from "chai";

test("Holding", () => {
  render(
    <Router>
      <Holding />
    </Router>
  );
  const testElement = screen.getAllByAltText("Jiaming Sun");
  expect(testElement).not.toBeNull();
});
