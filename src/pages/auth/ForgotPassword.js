import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "layout/Loader";
import ErrorMessage from "components/ErrorMessage";
import { apiPost } from "utils/apiFetch";
import pathObj from "utils/apiPath";
import useToastContext from "hooks/useToastContext";
import OButton from "components/reusable/OButton";
import { validationRules } from "utils/constants";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoImage from "../../assets/images/login-logo.png";
function ForgotPassword() {
  const { t } = useTranslation();
  const notification = useToastContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur", shouldFocusError: true, defaultValues: {} });
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const onSubmit = async (data) => {
    let res;
    try {
      setForgotPasswordLoading(true);
      res = await apiPost(pathObj.forgetPassword, data);
      if (res.data.success) {
        notification.success("Reset password has been sent to your email");
        reset();
      } else {
        notification.error(res?.data?.message);
      }
    } catch (err) {
      console.error("err:", err);
      notification.error(res?.data?.message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gradientFrom to-gradientTo h-full">
      <Loader />
      <div className="p-4">
        <div className="login-form bg-white max-w-lg m-auto mt-10 sm:mt-16 md:mt-28 rounded-[20px] overflow-hidden">
          <form
            className="sm:py-12 sm:px-11 py-8 px-7 dark:bg-slate-900"
            onSubmit={handleSubmit(onSubmit)}
            method="post"
          >
            <img src={logoImage} alt="logoImage" className="m-auto py-2 max-w-[267px]" style={{ filter: ` brightness(1) invert(1)` }} />
            <h1 className="text-center text-[40px] font-bold mb-6 dark:text-white">
              {t("FORGOT_PASSWORD")}
            </h1>
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="email"
                id="email"
                className="dark:text-white block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-black dark:border-[#DFDFDF]  focus:outline-none focus:ring-0  peer"
                placeholder=" "
                {...register("email", {
                  required: t("PLEASE_ENTER_EMAIL_ID"),
                  pattern: {
                    value: validationRules.email,
                    message: t("INVALID_EMAIL_ADDRESS"),
                  },
                })}
              />

              <label
                for="email"
                className="dark:bg-slate-900 dark:text-white peer-focus:font-normal absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                {t("O_EMAIL_ID")}
                <span className="text-red-500">*</span>
              </label>
              <ErrorMessage message={errors?.email?.message} />
            </div>

            <div className="text-center mt-8">
              <OButton
                label={<>{t("O_SUBMIT")}</>}
                type="submit"
                loading={forgotPasswordLoading}
              />
            </div>
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="ml-auto hover:underline text-sm font-medium dark:text-white"
              >
               
                {t("FORGOT_PASSWORD_BACK_TO")}{" "}
                <span className=" text-[#6236FF] hover:text-[#9D36FF]">
                 
                  {t("FORGOT_PASSWORD_LOGIN")}{" "}
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
