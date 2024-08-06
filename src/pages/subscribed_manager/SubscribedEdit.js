import { useForm } from "react-hook-form";
import { apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import helpers from "utils/helpers";
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import OInputField from "components/reusable/OInputField";
import FormValidation from "utils/formValidation";

const SubscribedEdit = ({ setEditShowModal, allGameType, item, viewType }) => {
  const { t } = useTranslation();
  const formValidation = FormValidation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      name: item?.name,
      price: item?.price,
      duration: item?.duration,
    },
  });
  const [loader, setLoader] = useState(false);
  const [availableFor, setAvailableFor] = useState(item?.duration ? item?.duration : "");
  const notification = useToastContext();

  // edit subscription function start
  const handleSubmitForm = async (data) => {
    try {
      setLoader(true);
      const obj = {
        ...data,
        duration: availableFor,
      };
      const path = `${apiPath.subscriptionEdit}/${item?._id}`;
      const result = await apiPut(path, { ...obj });
      if (result?.data?.success === true) {
        notification.success(result?.data?.message);
        allGameType();
        setEditShowModal(false);
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error:", error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className=" overflow-y-auto justify-center items-center flex overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col min-w-[552px] bg-white outline-none focus:outline-none">
              <div className="flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                <h3 className="text-xl font-semibold dark:text-white">{helpers.ternaryCondition(viewType == "edit", t("EDIT_SUBSCRIBED"), t("EDIT_OFFER"))}</h3>
                <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => setEditShowModal(false)}>
                  <button type="button" title={t("CLOSE")} className="hover:text-blue-700 transition duration-150 ease-in-out" data-bs-toggle="tooltip">
                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                  </button>
                </button>
              </div>
              <div className="flex justify-center mt-5">
                <div className="px-2 flex justify-center">
                  <OInputField
                    wrapperClassName="relative z-0 mb-3 w-[250px] group"
                    name="name"
                    inputLabel={
                      <>
                        {t("SUBSCRIPTION_NAME")}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    type="text"
                    autoFocus
                    register={register("name", formValidation.subscriptionName)}
                    errors={errors}
                  />
                </div>
                <div className="px-2 flex justify-center">
                  <OInputField
                    wrapperClassName="relative z-0 mb-3 w-[250px] group"
                    name="price"
                    inputLabel={
                      <>
                        {t("PRICE")}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    type="number"
                    register={register("price", formValidation.price)}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="mt-5 pl-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration</label>
                <div className="pl-0 pr-2 flex">
                  <div className="relative z-0 mb-3 w-[200px] group flex items-center">
                    <input
                      id="default-checkbox"
                      type="radio"
                      checked={availableFor === "month"}
                      name="default-radio"
                      onChange={() => {
                        setAvailableFor("month");
                      }}
                      className="w-4 cursor-pointer h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-300">
                      {t("MONTH")}
                    </label>
                  </div>
                  <div className="relative z-0 mb-3 w-[200px] group flex items-center">
                    <input
                      id="default-checkbox1"
                      type="radio"
                      checked={availableFor === "yearly"}
                      name="default-radio"
                      onChange={() => {
                        setAvailableFor("yearly");
                      }}
                      className="w-4 cursor-pointer h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="default-checkbox1" className="ml-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-300">
                      {t("YEARLY")}
                    </label>
                  </div>
                </div>
              </div>

              <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  title={t("CLOSE")}
                  onClick={() => setEditShowModal(false)}
                >
                  <IoClose size={19} /> {t("CLOSE")}
                </button>
                {viewType !== "view" &&
                  helpers.ternaryCondition(
                    loader,
                    <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                      <div className="spinner-container">
                        <div className="loading-spinner" />
                      </div>
                    </button>,
                    <button
                      className="bg-gradientTo flex gap-2  text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                      type="submit"
                      title={t("O_EDIT")}
                    >
                      <FaEdit size={16} />
                      {t("O_EDIT")}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default SubscribedEdit;
