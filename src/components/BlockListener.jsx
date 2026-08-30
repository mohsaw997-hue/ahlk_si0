import { useEffect, useState } from "react";
import axios from "axios";
import { api_route, socket } from "../App";

export default function BlockListener() {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const orderId = sessionStorage.getItem("id");
    if (!orderId) return;

    axios
      .get(`${api_route}/order/${orderId}/blocked`)
      .then((res) => setIsBlocked(!!res.data.blocked))
      .catch(() => {});

    const handleBlocked = (id) => {
      if (id === sessionStorage.getItem("id")) setIsBlocked(true);
    };
    const handleUnblocked = (id) => {
      if (id === sessionStorage.getItem("id")) setIsBlocked(false);
    };

    socket.on("clientBlocked", handleBlocked);
    socket.on("clientUnblocked", handleUnblocked);
    return () => {
      socket.off("clientBlocked", handleBlocked);
      socket.off("clientUnblocked", handleUnblocked);
    };
  }, []);

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <p className="text-xl text-gray-800 font-medium">الموقع غير متاح حاليا</p>
    </div>
  );
}
