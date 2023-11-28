import ErrorMessage from "components/ErrorMessage";
import OButton from "components/reusable/OButton";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { formLengthValidation, validationRules } from "utils/constants";
import OImage from "components/reusable/OImage";
import defaultImage from "../../assets/images/No-image-found.jpg";
import OInputField from "components/reusable/OInputField";
import formValidation from "utils/formValidation";
import { Link } from "react-router-dom";
import helper from "utils/helpers";

const VerifyPopup = ({ onHide, item, handleVerify, getAllUser }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const {
    register,
    formState: { errors },
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });

  const handleVerifyPopup = async (verifyItem, verifyStatus) => {
    console.log("item-handle", verifyItem);
    let path;
    let payload = {
      status: verifyStatus,
    };
    try {
      path = `${apiPath.userVerify}/${verifyItem?.userId}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        getAllUser({ statusChange: 1 });
        onHide();
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error.message);
    }
  };

  console.log("after-check", item);

  return (
    <div>
      <>
        <form>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6  w-full max-w-[600px] mx-auto">
              <div className="sm:py-4 sm:px-2 py-8 px-7 ">
                <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className=" flex items-center justify-between p-2 dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                    {/* <h3 className="text-xl font-semibold pl-3 dark:text-white">
                    {t("USER_VERIFIED")}
                  </h3> */}
                    <button
                      className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                      onClick={() => onHide()}
                    >
                      <span
                        className=" text-[#B8BBBF]  text-4xl "
                        title="Close"
                      >
                        ×
                      </span>
                    </button>
                  </div>

                  <div className="p-5 max-w-[350px] m-auto">
                    <div className="text-center">
                      <h6 className="text-2xl">
                        Do you really want this user as verify user?
                      </h6>
                    </div>

                    <div className="relative p-6 flex-auto dark:bg-slate-800 text-center pb-0">
                      <a
                        href={item?.image}
                        type="button"
                        download
                        target="_blank"
                      >
                        <figure className="inline-block overflow-hidden rounded-full border border-2">
                          <OImage
                            src={item?.image || defaultImage}
                            className="w-[100px] h-[100px] inline"
                            alt=""
                          />
                        </figure>
                      </a>
                    </div>
                  </div>
                  <label className="text-center block mb-2 text-sm font-medium text-gray-900 dark:text-white mb-4">
                    <strong className="mr-2">Move your Head : </strong>
                    <Link
                      to={item?.video}
                      className="underline"
                      target="_blank"
                    >
                      Click Here
                    </Link>
                  </label>
                  <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                    <OButton
                      label={t("ACCEPT")}
                      type="button"
                      onClick={() => handleVerifyPopup(item, "verified")}
                    />
                    <button
                      className="ml-4 text-black bg-[#E1E1E1] font-normal px-7 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        onHide();
                        handleVerifyPopup(item, "rejected");
                      }}
                    >
                      {t("Reject")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="opacity-25 fixed inset-0 z-40 bg-black"
            onClick={() => onHide()}
          />
        </form>
      </>
    </div>
  );
};

export default VerifyPopup;
