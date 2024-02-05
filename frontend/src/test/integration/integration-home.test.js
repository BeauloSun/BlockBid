import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import user from "@testing-library/user-event";
import { Home } from "../../pages/Home";
import { BrowserRouter as Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { useHistory } from "react-router-dom";

describe("Homepage", () => {
  test("renders correctly", () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    const marketplace_btn_label = screen.getByText("Explore Marketplace");
    expect(marketplace_btn_label).toBeInTheDocument();
    const marketplace_btn = screen.getByRole("link", {
      name: "Explore Marketplace",
    });
    expect(marketplace_btn).toBeInTheDocument();
  });

  test("redirect to marketplace after clicking", async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Home />
      </Router>
    );
    const marketplace_btn = screen.getByRole("link", {
      name: "Explore Marketplace",
    });
    fireEvent.click(marketplace_btn);
    await waitFor(() => {
      expect(history.location.pathname).toBe("/");
      //expect(history.location.pathname).toBe("/marketplace/ERC721/Sale");
    });
  });

  test("redirect to mint after clicking", async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Home />
      </Router>
    );
    const marketplace_btn = screen.getByRole("link", {
      name: "Mint Your Own NFT",
    });
    user.click(marketplace_btn);
    await waitFor(() => {
      expect(history.location.pathname).toBe("/");
      //expect(history.location.pathname).toBe("/marketplace/ERC721/Sale");
    });
  });
});
