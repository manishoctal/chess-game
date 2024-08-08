import { useForm, Controller } from "react-hook-form";
import { apiPut, apiPost, apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import helpers from "utils/helpers";
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import LoaderButton from "components/reusable/LoaderButton";
import { IoIosAddCircleOutline } from "react-icons/io";
import OInputField from "components/reusable/OInputField";
import FormValidation from "utils/formValidation";
import ErrorMessage from "components/ErrorMessage";
import DynamicLabel from "utils/DynamicLabel";
import OImage from "components/reusable/OImage";
import { AiFillCloseCircle } from "react-icons/ai";
import { startCase } from "lodash";
import axios from "axios";

const AddEditAchievement = ({ setEditShowOfferModal, viewType, allAchievement, offerDetails }) => {
  const { t } = useTranslation();
  const formValidation = FormValidation();
  const {
    handleSubmit,
    register,
    reset,
    clearErrors,
    setError,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {},
  });

  // default value for edit code
  useEffect(() => {
    if (offerDetails && viewType == "edit") {
      reset({
        name: offerDetails?.name,
        description: offerDetails?.description,
        rating: offerDetails?.rating,
        type: offerDetails?.type,
        criteria: offerDetails?.criteria,
        image: offerDetails?.image,
        gameType: offerDetails?.gameType?._id,
      });
    }
  }, [offerDetails]);

  const [loader, setLoader] = useState(false);
  const notification = useToastContext();
  const [type, setType] = useState(offerDetails?.type);
  const [criteria, setCriteria] = useState(offerDetails?.criteria);
  const [gameTypeList, setGameTypeList] = useState(offerDetails?.gameType?._id);
  const [recordsTemp, setRecordTemp] = useState("");
  const [image, setImage] = useState(offerDetails?.image ? { imgUrl: offerDetails?.image } : null);
  const [thubnailTitle, setThubnailTitle] = useState("");
  const [profilePicError, setProfilePicError] = useState("");

  const checkValidation = (image, setProfilePicError, errMessage) => {
    let isValid = true;
    if (image === "" || image === undefined) {
      isValid = false;
      setProfilePicError(errMessage);
    }
    return isValid;
  };

  // submit function start
  const handleSubmitForm = async (data) => {
    const isValid = checkValidation(image?.file || image?.imgUrl, setProfilePicError, "Please upload image.");
    if (!isValid) {
      return;
    }
    try {
      setLoader(true);

      // Upload the image to the presigned URL
      let payloadPre = {};
      if (image?.file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(image.file);
        reader.onloadend = async () => {
          const binaryData = reader.result;
          await axios.put(image.data.url, binaryData, { headers: { "Content-Type": "application/octet-stream" } });
        };
        payloadPre = { ...payloadPre, image: helpers.orOperator(image.data.key, null) };
      }
      // Proceed with form submission
      payloadPre = { ...payloadPre, name: data?.name, type: type, criteria: criteria, description: data?.description, rating: data?.rating, gameType: gameTypeList };
      const path = helpers.ternaryCondition(viewType == "add", apiPath.getAllAchievement, apiPath.getAllAchievement + "/" + offerDetails?._id);
      const apiFunction = helpers.ternaryCondition(viewType === "add", apiPost, apiPut);
      const result = await apiFunction(path, payloadPre);
      console.log("result", result);
      if (result?.status === 200) {
        notification.success(result?.data?.message);
        allAchievement({ statusChange: 1 });
        setEditShowOfferModal(false);
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error in get all badges list==>>>>", error.message);
      notification.error("An error occurred while uploading the image");
    } finally {
      setLoader(false);
    }
  };
  // submit function end

  const validateSelect = (value) => {
    setType(value);
    if (!value) {
      return "Please select type.";
    }
    return undefined;
  };

  const validateSelectCriteria = (value) => {
    setCriteria(value);
    if (!value) {
      return "Please select criteria.";
    }
    return undefined;
  };

  const handleFileThumbnail = (e, notification) => {
    const getType = e?.type?.split("/");
    if (getType) {
      const fileSize = (e?.size / (1024 * 1024)).toFixed(2);
      if (getType[1] !== undefined && (getType[1] === "jpeg" || getType[1] === "png" || getType[1] === "jpg")) {
        if (fileSize > 2) {
          notification.error("Please select image below 2 MB");
          return false;
        }
        return true;
      } else {
        notification.error("Only jpeg,png,jpg formats are allowed");
      }
    }
  };

  const handleThumbnail = async (e) => {
    if (!handleFileThumbnail(e?.target.files[0], notification)) return;

    try {
      const payloadPre = {
        contentType: e?.target.files[0].type,
      };
      const path = apiPath.getImageAchievement;

      const result = await apiGet(path, payloadPre);
      if (result?.data?.success) {
        setThubnailTitle(e?.target.files[0].name);
        let imageUrl = URL.createObjectURL(e?.target.files[0]);
        setImage({ file: e?.target.files[0], data: result.data.results, imgUrl: imageUrl });
        setProfilePicError("");
      } else {
        notification.error("Failed to get presigned URL");
      }
    } catch (error) {
      console.error("error in get banner list==>>>>", error.message);
      notification.error("An error occurred while getting presigned URL");
    }
  };

  const handleClearThumbnail = () => {
    setImage("");
  };

  const getGameTypeList = async () => {
    try {
      const res = await apiGet(apiPath.getGameType, {});
      setRecordTemp(res?.data?.results);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const selectCategory = (e) => {
    if (e.target.value) {
      setGameTypeList(e.target.value);
      clearErrors("gameType");
    } else {
      setGameTypeList("");
      setError("gameType", {
        type: "validation",
        message: "Please select game type.",
      });
    }
  };

  useEffect(() => {
    getGameTypeList();
  }, []);

  const imageClass = image ? "object-cover" : "object-contain";

  const handleKeyDown = (event) => {
    if (!["Backspace", "Delete", "Tab"].includes(event.key) && !/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  };
  const preventMax = (e) => {
    if (e.target.value.length > 4) {
      e.target.value = e.target.value.slice(0, 4);
    }
  };

  return (
    <>
      <div className=" overflow-y-auto justify-center items-center overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="overflow-hidden  dark:border-[#ffffff38] border border-white rounded-lg shadow-lg relative flex flex-col min-w-[552px] bg-white outline-none focus:outline-none">
              <div className="flex items-center justify-between p-5 dark:bg-gray-900 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                <h3 className="text-xl font-semibold dark:text-white">{helpers.ternaryCondition(viewType == "add", t("ADD"), t("EDIT"))}</h3>
                <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => setEditShowOfferModal(false)}>
                  <button type="button" title={t("CLOSE")} className="hover:text-blue-700 transition duration-150 ease-in-out" data-bs-toggle="tooltip">
                    <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                  </button>
                </button>
              </div>

              <div className="pb-4">
                <div className="grid grid-cols-2  items-baseline mt-5 gap-x-4 px-5">
                  <div className="">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("TYPE")}
                      <span className="text-red-500">*</span>
                    </label>

                    <Controller
                      name="type"
                      control={control}
                      rules={{ validate: validateSelect }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="block p-3 py-[10px] w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF] focus:outline-none focus:ring-0  peer"
                          onChange={(e) => {
                            field.onChange(e);
                            setType(e.target.value);
                          }}
                        >
                          <option defaultValue value="">
                            {t("SELECT_TYPE")}
                          </option>
                          <option value="achievement">{t("ACHIEVEMENT")}</option>
                          <option value="badges">{t("BADGES")}</option>
                        </select>
                      )}
                    />
                    {errors.type && <ErrorMessage message={errors.type.message} />}
                  </div>

                  <div className="">
                    <OInputField
                      wrapperClassName="relative z-0 mb-3 w-full group"
                      name="name"
                      inputLabel={
                        <>
                          {t("NAME")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="text"
                      autoFocus
                      register={register("name", formValidation.name)}
                      errors={errors}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2  items-baseline mt-3 gap-x-4 px-5">
                  <div className="">
                    <OInputField
                      wrapperClassName="relative z-0 mb-3 w-full group"
                      name="description"
                      inputLabel={
                        <>
                          {t("DESCRIPTION")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="text"
                      register={register("description", formValidation.description)}
                      errors={errors}
                    />
                  </div>
                  <div className="">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t("CRITERIA")}
                      <span className="text-red-500">*</span>
                    </label>

                    <Controller
                      name="criteria"
                      control={control}
                      rules={{ validate: validateSelectCriteria }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="block p-3 py-[10px] w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF] focus:outline-none focus:ring-0  peer"
                          onChange={(e) => {
                            field.onChange(e);
                            setType(e.target.value);
                          }}
                        >
                          <option defaultValue value="">
                            {t("SELECT")}
                          </option>
                          <option value="eloRating">{t("ELO_RATING")}</option>
                          <option value="gameWon">{t("GAME_WON")}</option>
                        </select>
                      )}
                    />
                    {errors.criteria && <ErrorMessage message={errors.criteria.message} />}
                  </div>
                </div>

                <div className="grid grid-cols-2  items-baseline mt-3 gap-x-4 px-5">
                  <div className="">
                    <OInputField
                      wrapperClassName="relative z-0 mb-3 w-full group"
                      name="rating"
                      inputLabel={
                        <>
                          {t("WON_MATCH_ELO_RATING")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      onKeyDown={(event) => handleKeyDown(event)}
                      onInput={(e) => preventMax(e)}
                      type="number"
                      register={register("rating", {
                        required: "Please enter won match/ ELO rating.",
                        min: {
                          value: type === "eloRating" ? 800 : 1,
                          message: type === "eloRating" ? "Minimum ELO rating must be 800." : "Minimum value must be 1.",
                        },

                        max: {
                          value: type === "eloRating" ? 2000 : "",
                          message: type === "eloRating" ? "Maximum ELO rating must be 2000." : "",
                        },
                        pattern: {
                          value: /^\d+$/,
                          message: "Decimals not allowed.",
                        },

                        validate: {
                          whiteSpace: (value) => (value.trim() ? true : t("WHITE_SPACES_NOT_ALLOWED")),
                        },
                      })}
                      errors={errors}
                    />
                  </div>
                  <div className="px-7 md:py-4 sm:px-2 sm:py-8">
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="gameType">
                        {" "}
                        {t("GAME_TYPE")}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="block p-3 py-[10px] w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF] focus:outline-none focus:ring-0  peer"
                        placeholder=" "
                        type="select"
                        id="gameType"
                        value={gameTypeList}
                        {...register("gameType", {
                          required: "Please select game name.",
                        })}
                        onChange={selectCategory}
                      >
                        <option value="">{t("SELECT_GAME_TYPE")}</option>
                        {recordsTemp &&
                          recordsTemp.map((item) => {
                            return <option value={item?._id}>{startCase(item?.gameType)}</option>;
                          })}
                      </select>

                      <ErrorMessage message={errors?.gameType?.message} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2  items-baseline mt-3 gap-x-4 px-5">
                  <div className="mt-3">
                    <div className="mb-4">
                      <div className="flex items-center">
                        <DynamicLabel name={t("UPLOAD_BANNER")} type={true} />
                        <span className="text-red-600 ml-3 mb-2 text-sm">({t("UPLOAD_MAX")})</span>
                      </div>

                      <div className="relative">
                        {image &&
                          helpers?.ternaryCondition(
                            image,
                            <span className="absolute right-[-5px] top-[-6px] ml-[9px] z-50 bg-white rounded-full">
                              <AiFillCloseCircle className="cursor-pointer  text-3xl" onClick={() => handleClearThumbnail()} />
                            </span>,
                            ""
                          )}

                        <div
                          className={` overflow-hidden relative block py-3 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer ${
                            image ? "h-[200px]" : "h-[80px]"
                          }`}
                        >
                          {image ? (
                            <div className="absolute right-0 top-0 bottom-0 left-0  flex items-center">
                              <div className="w-full h-full overflow-hidden">
                                <OImage src={image?.imgUrl} className={`w-full h-full m-auto ${imageClass}`} alt="" />
                              </div>
                            </div>
                          ) : (
                            <>
                              <input
                                type="file"
                                title={thubnailTitle}
                                accept="image/png, image/jpg, image/jpeg"
                                name="image"
                                className="opacity-0 absolute top-0 left-0 end-0 h-full z-10 cursor-pointer"
                                onChange={handleThumbnail}
                                onClick={(e) => (e.target.value = null)}
                              />
                              <span className="text-base justify-center cursor-pointer flex items-center pl-3 w-full absolute top-[0px] left-[0px] right-0 bottom-0 text-[#A5A5A5]">{t("UPLOAD_BANNER")}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-2">
                        <ErrorMessage message={profilePicError} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  title={t("CLOSE")}
                  onClick={() => setEditShowOfferModal(false)}
                >
                  <IoClose size={19} /> {t("CLOSE")}
                </button>
                {helpers.andOperator(
                  viewType !== "view",
                  helpers.ternaryCondition(
                    loader,
                    <LoaderButton />,
                    <button
                      className="bg-gradientTo flex gap-2 text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                      type="submit"
                      title={helpers.ternaryCondition(viewType == "add", t("O_ADD"), t("O_EDIT"))}
                    >
                      {helpers.ternaryCondition(
                        viewType == "add",
                        <>
                          {" "}
                          <IoIosAddCircleOutline size={18} />
                          {t("O_ADD")}
                        </>,
                        <>
                          <FaEdit size={16} />
                          {t("O_EDIT")}
                        </>
                      )}{" "}
                    </button>
                  )
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

export default AddEditAchievement;
