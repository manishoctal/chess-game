import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useForm } from "react-hook-form";
import useToastContext from "hooks/useToastContext";
import ErrorMessage from "components/ErrorMessage";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import { preventMaxInput } from "utils/validations";
import formValidation from "../../utils/formValidation";
import { validateFile } from "utils/reusableMethods";
import OTextArea from "components/reusable/OTextArea";
import { TagsInput } from "react-tag-input-component";
import OButton from "components/reusable/OButton";

const AddEditEffects = ({ onClose, getAllEffect, item, type }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(type === "edit" ? item?.tag : []);
  const [widget, setWidget] = useState();

  const [imageName, setImageName] = useState();
  const [fileMsg, setFileMsg] = useState();
  const [image, setImage] = useState();

  const [effectName, setEffectName] = useState();
  const [fileMsgEffect, setFileMsgEffect] = useState();
  const [imageEffect, setImageEffect] = useState();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      displayName: item?.displayName,
      description: item?.description,
      duration: item?.duration,
      playlistName: item?.playlistName,
      widgetId: item?.widget?._id,
    },
  });

  // const fileValid = () => {
  //   let isValidImage = false;
  //   if (image) {
  //     setFileMsg("");
  //     isValidImage = true;
  //   } else {
  //     setFileMsg("Please add a widget thumbnail.");
  //   }
  //   return { isValidImage };
  // };
  const fileValidEffect = () => {
    let isValidImage = false;
    if (imageEffect) {
      setFileMsgEffect("");
      isValidImage = true;
    } else {
      setFileMsgEffect("Please upload effect.");
    }
    return { isValidImage };
  };

  const handleSubmitForm = async (data) => {
    // const isValid = fileValid();
    const isValidEffect = fileValidEffect();
    // if (!isValid?.isValidImage) {
    //   return;
    // }
    if (!isValidEffect?.isValidImage) {
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (image && !image.includes(".jpg")) {
        const response = await fetch(image);
        let newData = await response.blob();
        const metadata = {
          type: "image/*",
        };
        const file = new window.File([newData], `${image}.jpg`, metadata);
        formData.append("thumbnail", file);
      }

      if (imageEffect) {
        const response = await fetch(imageEffect);
        let data = await response.blob();
        const metadata = {
          type: "videofx/*",
        };
        const file = new window.File([data], `${image}.videofx`, metadata);
        formData.append("url", file);
      }

      console.log("data.widgetId", data.widgetId);

      formData.append("displayName", data.displayName);
      formData.append("description", data.description);
      formData.append("duration", data.duration);
      formData.append("widgetId", data.widgetId);
      formData.append("tag", JSON.stringify(selected));
      let path;
      if (type === "add") {
        path = apiPath.effects;
        const result = await apiPost(path, formData);
        if (result.data.success) {
          getAllEffect();
          onClose();
          reset();
          notification.success(result?.data.message);
        } else {
          notification.error(result?.data.message);
        }
      } else if (type === "edit") {
        path = apiPath.effects + "/" + item?._id;
        const result = await apiPut(path, formData);
        if (result.data.success) {
          getAllEffect();
          onClose();
          reset();
          notification.success(result?.data.message);
        } else {
          notification.error(result?.data.message);
        }
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error);
      notification.error(error.message);
    }
    setIsLoading(false);
  };

  const getWidgetId = async () => {
    try {
      const path = apiPath.widgets;
      const result = await apiGet(path, { contentType: "EffectsNFilters" });
      if (result.data.success) {
        setWidget(result.data?.results);
      } else {
        notification.error("Error with fetching widget");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const onChangePicture = ({ e, type }) => {
    if (type === "image") {
      const validMessage = validateFile(e.target.files[0]);
      if (validMessage) {
        setFileMsg(validMessage);
        image("");
        setImageName("");
      } else {
        setImage(URL.createObjectURL(e.target.files[0]));
        setFileMsg("");
        setImageName(e.target.files[0].name);
      }
    } else if (type === "effect") {
      setImageEffect(URL.createObjectURL(e.target.files[0]));
      setFileMsgEffect("");
      setEffectName(e.target.files[0].name);
    }
  };

  const ImageThumbnail = () => {
    return (
      <>
        <div>
          <label htmlFor="floating_file">Upload thumbnail</label>
          <div className="relative z-0   w-full group">
            <div className="block py-2 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer">
              <input
                type="file"
                name="widgetThumbnail"
                placeholder="Widget thumbnail"
                onChange={(e) => onChangePicture({ e, type: "image" })}
                style={{ color: "transparent" }}
                className="form-control"
                accept="image/png,image/jpeg,image/jpg"
              />

              <div className="image_title">
                {" "}
                {imageName?.length > 17
                  ? imageName?.substring(0, 12) +
                    "..." +
                    imageName?.substring(
                      imageName?.length - 5,
                      imageName?.length
                    )
                  : imageName}
              </div>
            </div>

            <div>
              {image && !fileMsg && (
                <img
                  src={
                    image !== null
                      ? image
                      : URL.createObjectURL(watch("passportWatch")[0])
                  }
                  className="mt-5"
                  style={{
                    width: "8rem",
                    height: "8rem",
                    borderRadius: "8px",
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                  }}
                  alt="display"
                />
              )}
              <ErrorMessage message={fileMsg} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const UploadEffect = () => {
    return (
      <>
        <div>
          <label htmlFor="floating_file">
            Upload effect (.arscene, .videofx){" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative z-0   w-full group">
            <div className="block py-2 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer">
              <input
                type="file"
                name="url"
                placeholder="Upload effect"
                onChange={(e) => onChangePicture({ e, type: "effect" })}
                style={{ color: "transparent" }}
                className="form-control"
                accept=".arscene, .videofx"
              />

              <div className="image_title">
                {" "}
                {effectName?.length > 17
                  ? effectName?.substring(0, 12) +
                    "..." +
                    effectName?.substring(
                      effectName?.length - 5,
                      effectName?.length
                    )
                  : effectName}
              </div>
            </div>

            <div>
              {/* {(imageEffect && !fileMsgEffect) && <img
        src={imageEffect !== null ? imageEffect : URL.createObjectURL(watch('passportWatch')[0])}
        className='mt-5'
        style={{ width: '8rem', height: '8rem', borderRadius: '8px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }} alt='display' />} */}
              <ErrorMessage message={fileMsgEffect} />
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    getWidgetId();
  }, []);

  useEffect(() => {
    if (widget && type === "edit") {
      setValue("widgetId", item?.widgetId?._id);
      setImage(item?.thumbnail);
      setImageEffect(item?.url);
      setEffectName(item?.url);
    }
  }, [widget]);

  const typeName = type === "add" ? "Add" : "Edit";

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="md:py-4 sm:px-2 sm:py-8 px-7">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:min-w-[762px]">
              <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold">{typeName} Effect</h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>
              <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
                <div className="relative p-6 flex-auto">
                  <div className="grid grid-cols-2">
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <OInputField
                        wrapperClassName="relative z-0  w-full group"
                        name="displayName"
                        inputLabel={
                          <>
                            Display Name<span className="text-red-500">*</span>
                          </>
                        }
                        type="text"
                        autoFocus
                        maxLength={500}
                        onInput={(e) => preventMaxInput(e, 500)}
                        register={register(
                          "displayName",
                          formValidation.displayName
                        )}
                        errors={errors}
                      />
                    </div>
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <OInputField
                        wrapperClassName="relative z-0  w-full group"
                        name="duration"
                        inputLabel={
                          <>
                            Duration<span className="text-red-500">*</span>
                          </>
                        }
                        type="number"
                        maxLength={5000}
                        preventDecimal
                        // isDecimal={true}
                        onInput={(e) => preventMaxInput(e, 5000)}
                        register={register("duration", formValidation.duration)}
                        errors={errors}
                      />
                    </div>

                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <ImageThumbnail className="mt-4" />
                    </div>
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <UploadEffect className="mt-4" />
                    </div>

                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Widget name<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="widgetId"
                        type="widgetId"
                        name="widgetId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder=" "
                        {...register("widgetId", {
                          required: "Please select widget name.",
                        })}
                        //onClick={nextPage}
                      >
                        <option value="">Select widget name</option>
                        {/* {widget?.hasPrevPage && <option value='' id='previous'>
                          Previous
                                                </option>} */}

                        {widget
                          ? widget?.map((val) => (
                              <option value={val?._id} key={val?._id}>
                                {val?.name}
                              </option>
                            ))
                          : null}
                        {/* {widget?.hasNextPage && <option value='' id='next'>
                          More
                                                </option>} */}
                      </select>

                      <ErrorMessage message={errors?.widgetId?.message} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1">
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Description<span className="text-red-500">*</span>
                      </label>
                      <OTextArea
                        wrapperClassName="relative z-0  w-full group"
                        name="description"
                        inputLabel={
                          <>
                            Description<span className="text-red-500">*</span>
                          </>
                        }
                        type="text"
                        maxLength={15000}
                        onInput={(e) => preventMaxInput(e, 15000)}
                        register={register(
                          "description",
                          formValidation.description
                        )}
                        errors={errors}
                      />
                    </div>
                  </div>
                  {/* <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2 col-span-2">
                    <label
                      htmlFor="inputTag"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Enter tag
                    </label>
                    <TagsInput
                      value={selected}
                      onChange={setSelected}
                      name="inputTag"
                      placeHolder="Enter tags"
                    />
                    <em>Press enter to add new tag</em>
                  </div> */}
                </div>

                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                    type="button"
                    onClick={onClose}
                  >
                    {t("O_BACK")}
                  </button>

                  <OButton
                    label={typeName}
                    disabled={isLoading}
                    className="bg-gradientTo"
                    type="submit"
                    onClick={() => {
                      // fileValid();
                      fileValidEffect();
                    }}
                    loading={isLoading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default AddEditEffects;
