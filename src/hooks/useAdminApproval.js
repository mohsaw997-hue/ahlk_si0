import { useEffect, useRef, useState } from "react";
import { socket } from "../App";
import { useLanguage } from "./useLanguage";

export function useAdminApproval({
  orderId,
  acceptEvent,
  declineEvent,
  declineMessageKey = "declineLogin",
  onAccept,
  onDecline,
}) {
  const { t } = useLanguage();
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);
  const onAcceptRef = useRef(onAccept);
  const onDeclineRef = useRef(onDecline);

  onAcceptRef.current = onAccept;
  onDeclineRef.current = onDecline;

  useEffect(() => {
    if (!orderId) return;

    const handleAccept = (payload) => {
      if (payload === orderId) {
        setWaiting(false);
        onAcceptRef.current?.();
      }
    };

    const handleDecline = (payload) => {
      if (payload === orderId) {
        setWaiting(false);
        setError(true);
        onDeclineRef.current?.();
      }
    };

    socket.on(acceptEvent, handleAccept);
    socket.on(declineEvent, handleDecline);

    return () => {
      socket.off(acceptEvent, handleAccept);
      socket.off(declineEvent, handleDecline);
    };
  }, [orderId, acceptEvent, declineEvent]);

  return {
    waiting,
    setWaiting,
    error,
    setError,
    clearError: () => setError(false),
    declineMessage: error ? t(declineMessageKey) : null,
  };
}
