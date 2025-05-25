// pages/_app.js
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Navbar />
        <Component {...pageProps} />
      </AuthProvider>
    </HelmetProvider>
  );
}
