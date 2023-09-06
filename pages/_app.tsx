import React from "react";
import { Providers } from "../components/Providers";
import "../styles/DatePicker.css";
import App from "./App"; // Ensure your App component is inside components or similar directory.

function HomePage() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}

export default HomePage;
