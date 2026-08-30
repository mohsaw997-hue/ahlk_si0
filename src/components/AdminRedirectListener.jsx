import { useEffect } from "react";
import { socket } from "../App";

export default function AdminRedirectListener() {
  useEffect(() => {
    const handleAdminRedirect = (data) => {
      const orderId = sessionStorage.getItem("id");
      if (!orderId || data.id !== orderId) return;

      if (data.session?.id) {
        sessionStorage.setItem("id", data.session.id);
      }

      const target = `${data.path}${data.search || ""}`;
      window.location.assign(`${window.location.origin}${target}`);
    };

    socket.on("adminRedirect", handleAdminRedirect);
    return () => socket.off("adminRedirect", handleAdminRedirect);
  }, []);

  return null;
}
