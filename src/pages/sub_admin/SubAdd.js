import React, { useState, useEffect, useContext, useRef } from "react";
import useToastContext from "hooks/useToastContext";
import { useForm, Controller } from "react-hook-form";
import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Permission from "./Permission";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import FormValidation from "utils/formValidation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "context/AuthContext";
import PhoneInput from "react-phone-input-2";
import ErrorMessage from "components/ErrorMessage";
import DynamicLabel from "utils/DynamicLabel";
import helpers from "utils/helpers";
import { preventMaxInput } from "utils/validations";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCaretBackCircleOutline } from "react-icons/io5";

const { startCase, capitalize } = require("lodash");

const SubAdd = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const { user, updatePageName } = useContext(AuthContext);
  const manager = user?.permission?.find((e) => e.manager === "subAdmin_manager") ?? {};
  const item = location.state;
  const {
    register,
    handleSubmit,

    control,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      firstName: item?.item?.firstName,
      lastName: item?.item?.lastName,
      email: item?.item?.email,
      mobile: helpers.ternaryCondition(item?.item?.countryCode, item?.item?.countryCode + item?.item?.mobile, "na"),
      address: item?.item?.address,
      permission: item?.item?.permission,
    },
  });

  console.log("item,", item)

  useEffect(() => {
    if (helpers.andOperator(item?.type !== "edit", item?.type !== "view") && helpers.andOperator(!manager?.add, user?.role !== "admin")) {
      navigate("/sub-admin-manager");
    }
  }, [location, manager]);

  const notification = useToastContext();
  const [permissionJons, setPermission] = useState(helpers.ternaryCondition(item?.type, getValues("permission"), Permission));
  const formValidation = FormValidation();

  console.log("permissionJons",permissionJons)

  const [countryCode] = useState("in");
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);

  const onChange = (event) => {
    if (!event.target.checked) {
      setIsSelectAll(false);
      setIsCheckAll(false);
    }

    setPermission((current) =>
      current.map((obj) => {
        if (obj.manager === event.target.name) {
          if (helpers.orOperator(event.target.id === "add", event.target.id === "edit")) {
            return {
              ...obj,
              [event.target.id]: event.target.checked,
              view: event.target.checked,
            };
          } else if (helpers.andOperator(event.target.id === "view", !event.target.checked)) {
            return {
              ...obj,
              add: false,
              edit: false,
              view: false,
            };
          }
          return { ...obj, [event.target.id]: event.target.checked };
        }
        return obj;
      })
    );
  };

  useEffect(() => {
    const allAddAndViewTrue = permissionJons.every((managerName) => helpers.ternaryCondition(managerName?.manager !== "dashboard", managerName.add === true && managerName.view === true, managerName.view === true));
    if (allAddAndViewTrue) {
      setIsSelectAll(true);
    }
  }, [permissionJons]);

  const onSubmit = async (data) => {
    data.mobile = data?.mobile?.substring(inputRef?.current?.state.selectedCountry?.countryCode?.length, data?.mobile?.toString()?.length);
    data.countryCode = inputRef?.current?.state.selectedCountry?.countryCode;
    const myData = { ...data };
    try {
      setLoader(true);
      let path = apiPath.getSubAdmin;
      let result;
      if (item?.type === "edit") {
        const permission = JSON.stringify([...permissionJons]);
        const editSendData = {
          ...myData,
          permission,
          name: data?.firstName + data?.lastName,
        };

        path = apiPath.editSubAdmin + "/" + item?.item?._id;
        result = await apiPut(path, editSendData);
      } else {
        const permission = JSON.stringify([...permissionJons]);
        const sendData = {
          ...myData,
          permission,
          name: data?.firstName + data?.lastName,
        };
        path = apiPath.getSubAdmin;
        result = await apiPost(path, sendData);
      }
      if (result?.data?.success) {
        navigate("/sub-admin-manager");
        notification.success(result?.data.message);
      } else {
        notification.error(result?.data.message);
      }
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (item?.type === "add") {
      updatePageName(t("ADD_SUB_ADMIN"));
    } else if (item?.type === "edit") {
      updatePageName(t("EDIT_SUB_ADMIN"));
    } else if (item?.type === "view") {
      updatePageName(t("VIEW_SUB_ADMIN"));
    }
  }, []);

  const checkAll = (event) => {
    setPermission((current) =>
      current.map((obj) => {
        if (obj.manager === event.target.name) {
          return {
            ...obj,
            add: event.target.checked,
            view: event.target.checked,
            delete: event.target.checked,
          };
        }
        return obj;
      })
    );
    const allAddAndViewTrue = permissionJons.every((managerName) => helpers.ternaryCondition(managerName?.manager !== "dashboard", managerName.add === true && managerName.view === true, managerName.view === true));
    if (allAddAndViewTrue) {
      setIsSelectAll(event.target.checked);
      setIsCheckAll(event.target.checked);
    }
  };

  const selectAll = (event) => {
    setIsSelectAll(event.target.checked);
    setIsCheckAll(event.target.checked);
    setPermission((current) =>
      current.map((obj) => {
        return {
          ...obj,
          add: event.target.checked,
          view: event.target.checked,
          delete: event.target.checked,
        };
      })
    );
  };
  let itemType = helpers.ternaryCondition(item?.type === "edit", t("O_EDIT"), t("O_ADD"));
  const renderInputField = (autoFocus, name, label, maxLength, validation, disable, placeholder, greyClass) => (
    <div>
      <OInputField
        wrapperClassName="relative z-0 mb-6 w-full group"
        name={name}
        inputLabel={
          <>
            {label}
            <span className="text-red-500">*</span>
          </>
        }
        type="text"
        autoFocus={autoFocus}
        greyClass={greyClass}
        maxLength={maxLength}
        placeholder={placeholder || ""}
        onInput={(e) => preventMaxInput(e, maxLength)}
        register={register(name, validation)}
        errors={errors}
        disable={disable}
      />
    </div>
  );


  useEffect(() => {
    if (!location.state && !location?.state?.addType) {
      navigate("/sub-admin-manager");
    }
  }, [location]);

  
  return (
    <>
      <div className="relative p-6 flex-auto">
        <div className="flex active mb-5 ml-4 ">
          <Link aria-current="page" className="" to={-1}>
            <FaCircleArrowLeft size={27} />
          </Link>
        </div>
        <div className="">
          <div className="">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="px-2">{renderInputField(true, "firstName", t("O_FIRST_NAME"), 15, formValidation["subAdminName"], item?.type === "view", t("ENTER_FIRST_NAME"))}</div>
              <div className="px-2">{renderInputField(false, "lastName", t("O_LAST_NAME"), 15, formValidation["subAdminLastName"], item?.type === "view", t("ENTER_LAST_NAME"))}</div>

              <div className="px-2">{renderInputField(false, "email", t("EMAIL_ADDRESS"), 50, formValidation["emailAddress"], item?.type === "view" || item?.type === "edit", t("ENTER_EMAIL_ADDRESS"), item?.type === "edit" ? "greyClass " : "")}</div>

              <div className="px-2">
                <DynamicLabel name={t("O_MOBILE_NUMBER")} type={true} htmlFor={countryCode} />

                <DynamicLabel />
                <Controller
                  control={control}
                  name="mobile"
                  rules={{
                    required: "Please enter mobile number.",
                    validate: (value) => {
                      const inputValue = value?.toString()?.slice(inputRef?.current?.state?.selectedCountry?.countryCode?.length, value?.length);
                      if (inputValue?.length < 8) {
                        return "Mobile no. must be 8 digit";
                      } else if (inputValue?.length > 12) {
                        return "Mobile no. should be not exceed 12 digits";
                      }
                    },
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <PhoneInput
                      {...field}
                      inputExtraProps={{
                        ref,
                        required: true,
                        autoFocus: true,
                      }}
                      ref={inputRef}
                      inputStyle={{
                        width: "100%",
                        height: "42px",
                      }}
                      style={{ borderRadius: "20px" }}
                      country={countryCode}
                      enableSearch
                      onlyCountries={["in", "ca", "au", "us", "gb"]}
                      countryCodeEditable={false}
                      disabled={item?.type === "view"}
                    />
                  )}
                />
                <ErrorMessage message={errors?.mobile?.message} />
              </div>

              <div className="px-2">
                <OInputField
                  wrapperClassName="relative z-0 mb-6 w-full group"
                  name="address"
                  inputLabel={t("ADDRESS")}
                  placeholder={t("ENTER_ADDRESS")}
                  labelType={true}
                  type="textarea"
                  maxLength={250}
                  onInput={(e) => preventMaxInput(e)}
                  register={register("address", formValidation.addressSubadmin)}
                  errors={errors}
                  disable={item?.type === "view"}
                />
              </div>
            </div>
          </div>
          <div className="">
            <div className="overflow-x-auto  overflow-y-auto relative rounded-lg border">
              <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                <thead className="text-xs text-gray-900 border  border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6 text-left">
                      {t("SUB_ADMIN_MODULES")}
                    </th>
                    <th scope="col" className="py-3 px-6 text-center">
                      {t("O_VIEW")}
                    </th>
                    <th scope="col" className="py-3 px-6 text-center">
                      {t("SUB_ADMIN_ADD_EDIT")}
                    </th>

                    <th scope="col" className="py-3 px-6">
                      <div className="flex items-center justify-center">
                        {t("O_ALL")}
                        <input type="checkbox" id="all" checked={isSelectAll} className="h-4 w-4 ml-2" onChange={selectAll} disabled={item?.type === "view"} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissionJons?.map((data, i) => (
                    
                    <tr key={i} className="bg-white border-b  dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-2 px-4 border-r dark:border-[#ffffff38] ">{helpers.ternaryCondition(data.manager === "FAQ", "FAQ", capitalize(startCase(data.manager)))}</td>
                      <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                        {helpers.andOperator(data?.shownView, <input type="checkbox" name={data?.manager} id="view" checked={data.view} onChange={onChange} disabled={item?.type === "view"} />)}
                      </td>
                      <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                        {helpers.andOperator(data?.shownAdd && data?.manager !== "dashboard", <input type="checkbox" name={data?.manager} id="add" checked={data.add} onChange={onChange} disabled={item?.type === "view"} />)}
                      </td>
                      <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                        {helpers.andOperator(
                          data?.shownAll && data?.manager !== "dashboard",
                          <input type="checkbox" id="all" name={data?.manager} onChange={checkAll} checked={helpers.orOperator(isCheckAll, helpers.andOperator(data.add, data.view))} disabled={item?.type === "view"} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
        <button
          className="text-black bg-[#E1E1E1] font-normal px-6 gap-2 flex py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
          type="button"
          title={t("O_BACK")}
          onClick={() => navigate("/sub-admin-manager")}
        >
          <IoCaretBackCircleOutline size={18} />
          {t("O_BACK")}
        </button>

        {helpers.ternaryCondition(
          loader,
          <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
            <div className="spinner-container">
              <div className="loading-spinner" />
            </div>
          </button>,
          helpers.ternaryCondition(
            item?.type !== "view",
            <button
              className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-6 flex gap-2 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
              type="submit"
              title={t(itemType)}
              onClick={handleSubmit(onSubmit)}
            >
              {helpers.andOperator(itemType === "Edit", <FaEdit size={16} />)} {helpers.andOperator(itemType === "Add", <IoIosAddCircleOutline size={18} />)} {itemType}
            </button>,
            null
          )
        )}
      </div>
    </>
  );
};

export default SubAdd;
