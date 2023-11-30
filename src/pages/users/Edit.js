import React, { useState } from "react";
import { apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useForm } from "react-hook-form";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import { preventMaxInput } from "utils/validations";
import formValidation from "../../utils/formValidation";

const UserEdit = ({ setEditShowModal, getAllUser, item }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      firstName: item?.firstName,
      lastName: item?.lastName,
      mobile: item?.mobile,
      email: item?.email,
      countryCode: item?.countryCode,
      language: item?.language,
      role: item?.role
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const path = apiPath.updateUser + "/" + item._id;
      const result = await apiPut(path, data);
      if (result.data.success) {
        getAllUser();
        setEditShowModal(false);
        notification.success(result?.data.message);
      } else {
        notification.error(result?.data.message);
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error);
      notification.error(error.message);
    }
    setIsLoading(false);
  };
  const codeValue = watch("email") ? watch("email") : "";
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="md:py-4 sm:px-2 sm:py-8 px-7">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:min-w-[762px]">
              <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold">{t("EDIT_USER")}</h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={() => setEditShowModal(false)}
                >
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="grid grid-cols-2">
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0  w-full group"
                      name="firstName"
                      inputLabel={
                        <>
                          {t("MERCHANT_FIRST_NAME")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="text"
                      autoFocus
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      register={register(
                        "firstName",
                        formValidation["firstName"]
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      name="lastName"
                      inputLabel={
                        <>
                          {t("MERCHANT_LAST_NAME")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="text"
                      maxLength={15}
                      onInput={(e) => preventMaxInput(e, 15)}
                      register={register(
                        "lastName",
                        formValidation["lastName"]
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      name="countryCode"
                      inputLabel={<>{t("O_COUNTRY_CODE")} <span className="text-red-500">*</span></>}
                      errors={errors}
                      type="number"
                      register={register("countryCode", {
                        // required: 'Please select country code.'
                      })}
                     
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      name="country_code"
                      inputLabel={<>{t("LANGUAGE")} <span className="text-red-500">*</span></>}
                      errors={errors}
                      type="text"
                      register={register("language", {
                        // required: 'Please select country code.'
                      })}
                     
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      type="number"
                      name="mobile"
                      id="mobile"
                      inputLabel={
                        <>
                          {t("O_MOBILE_NUMBER")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      min={0}
                      onKeyDown={(e) => {
                        if (["-", "+", "e"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onInput={(e) => preventMaxInput(e, 10)}
                      register={register("mobile", formValidation["mobile"])}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      type="text"
                      name="email"
                      id="email"
                      inputLabel={
                        <>
                          {t("O_EMAIL_ID")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      value={codeValue.toLowerCase()}
                      maxLength={50}
                      autoComplete="off"
                      onInput={(e) => preventMaxInput(e, 50)}
                      register={register("email", formValidation["email"])}
                      errors={errors}
                    />
                  </div>
                  <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                    <OInputField
                      wrapperClassName="relative z-0   w-full group"
                      type="text"
                      name="role"
                      id="role"
                      inputLabel={
                        <>
                          {t("USER_TYPE")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      disable
                      maxLength={50}
                      autoComplete="off"
                      register={register("role")}
                      
                    />
                  </div>
                 
                  
                </div>
              </div>
              <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setEditShowModal(false)}
                >
                  {t("O_BACK")}
                </button>

                {isLoading ? (
                  <div className="spinner-container bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <button
                    className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    {t("O_EDIT")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default UserEdit;
