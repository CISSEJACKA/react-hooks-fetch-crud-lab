import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // Make sure this import is present

import App from "../components/App";

test("renders App component", () => {
  render(<App />);
  const headingElement = screen.getByText(/Quiz Questions/i);
  expect(headingElement).toBeInTheDocument();
});



