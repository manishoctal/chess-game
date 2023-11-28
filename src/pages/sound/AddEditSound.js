import React, { useEffect, useState } from "react";
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
import { TagsInput } from "react-tag-input-component";
import OTextArea from "components/reusable/OTextArea";

const AddEditSound = ({ onClose, getAllSound, item, type }) => {
  console.log("onClose", onClose);
  const { t } = useTranslation();
  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [widget, setWidget] = useState();

  const [imageName, setImageName] = useState({
    sound_image: null,
    sound_file: null,
  });
  const [fileMsg, setFileMsg] = useState({ sound_image: "", sound_file: "" });
  const [selected, setSelected] = useState(
    type === "edit" ? item?.keyword?.split(",") : []
  );
  const [fileError, setFileError] = useState({ image: false, audio: false });
  const [soundImage, setSoundImage] = useState({
    img: null,
    url: type === "edit" ? item?.image : null,
  });
  const [soundAudio, setSoundAudio] = useState({
    img: null,
    url: type === "edit" ? item?.sound : null,
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      sound_image: type === "edit" ? item?.sound_image : null,
      sound_file: type === "edit" ? item?.sound_file : null,
      soundName: type === "edit" ? item?.name : null,
      playlistName: type === "edit" ? item?.playlistName : null,
      artistName: type === "edit" ? item?.artistName : null,
      keyword: type === "edit" ? item?.keyword : null,
      displayName: type === "edit" ? item?.displayName : null,
      duration: type === "edit" ? item?.duration : null,
      description: type === "edit" ? item?.description : null,
    },
  });
  const fileValid = () => {
    let isValidImage = false;
    let isValidAudio = false;

    if (soundImage.url) {
      setFileError((prevErrors) => ({ ...prevErrors, image: false }));
      isValidImage = true;
    } else {
      setFileError((prevErrors) => ({ ...prevErrors, image: true }));
      setFileMsg((prevMsg) => ({
        ...prevMsg,
        sound_image: "Please add a sound image.",
      }));
    }
    if (soundAudio.url) {
      setFileError((prevErrors) => ({ ...prevErrors, audio: false }));
      isValidAudio = true;
    } else {
      setFileError((prevErrors) => ({ ...prevErrors, audio: true }));
      setFileMsg((prevMsg) => ({
        ...prevMsg,
        sound_file: "Please add a sound.",
      }));
    }
    return { isValidAudio, isValidImage };
  };
  const handleSubmitForm = async (data) => {
    const isValid = fileValid();
    if (!(isValid?.isValidAudio && isValid?.isValidImage)) {
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (soundImage.url && soundImage.img) {
        const response = await fetch(soundImage.url);
        const newData = await response.blob();

        const metadata = {
          type: "image/*",
        };
        const imageFile = new window.File(
          [newData],
          `${soundImage.img}.jpg`,
          metadata
        );
        formData.append("image", imageFile);
      }
      if (soundAudio.url && soundAudio.img) {
        const response = await fetch(soundAudio.url);
        const audioData = await response.blob();
        const metadata = {
          type: "audio/*",
        };
        const file = new window.File(
          [audioData],
          `${soundAudio.img + new Date().getSeconds()}.mp3`,
          metadata
        );
        formData.append("sound", file);
      }

      formData.append("name", data.soundName);
      formData.append("playlistName", data.playlistName);
      formData.append("artistName", data.artistName);
      formData.append("keyword", selected);
      formData.append("displayName", data.displayName);
      formData.append("duration", data.duration);
      formData.append("widgetId", data.widgetId);
      formData.append("description", data.description);
      console.log("formData", formData);
      let path;
      if (type === "add") {
        path = apiPath.addSound;
        const result = await apiPost(path, formData);
        if (result.data.success) {
          getAllSound();
          onClose();
          notification.success(result?.data.message);
        } else {
          notification.error(result?.data.message);
        }
      } else if (type === "edit") {
        path = apiPath.addSound + "/" + item?._id;
        const result = await apiPut(path, formData);
        if (result.data.success) {
          getAllSound();
          onClose();
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
      const result = await apiGet(path, { contentType: "Sounds" });
      if (result?.data?.success) {
        setWidget(result?.data?.results);
      } else {
        notification.error("Error with fetching widget");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const onChangePicture = ({ e, type }) => {
    console.log("onChangePicture", e.target.files.length);
    console.log("type", type);
    if (e.target.files.length && type === "image") {
      const validMessage = validateFile(e.target.files[0]);
      if (validMessage) {
        setFileMsg({
          ...fileMsg,
          sound_image: validMessage,
        });
        setFileError({ ...fileError, image: true });
        setSoundImage({ url: null, img: null });
        setImageName({ ...imageName, sound_image: null });
      } else {
        setSoundImage({
          url: URL.createObjectURL(e.target.files[0]),
          img: URL.createObjectURL(e.target.files[0]),
        });
        setFileMsg({
          ...fileMsg,
          sound_image: "",
        });
        setImageName({ ...imageName, sound_image: e.target.files[0].name });
        setFileError({ ...fileError, image: false });
      }
    } else if (e.target.files.length && type === "audio") {
      const validMessage = validateFile(e.target.files[0], (type = "audio"));
      if (validMessage) {
        setFileMsg({
          ...fileMsg,
          sound_file: validMessage,
        });
        setFileError({ ...fileError, audio: true });
        setSoundAudio({ url: null, img: null });
        setImageName({ ...imageName, sound_file: null });
      } else {
        setSoundAudio({
          url: URL.createObjectURL(e.target.files[0]),
          img: URL.createObjectURL(e.target.files[0]),
        });
        setFileMsg({
          ...fileMsg,
          sound_file: "",
        });
        setImageName({ ...imageName, sound_file: e.target.files[0].name });
        setFileError({ ...fileError, audio: false });
      }
    }
  };
  useEffect(() => {
    getWidgetId();
  }, []);

  useEffect(() => {
    if (widget && type === "edit") {
      setValue("widgetId", item?.widgetId?._id);
    }
  }, [widget]);

  const ImageSide = () => {
    return (
      <>
        <div className="relative z-0   w-full group">
          <div className="block py-3 h-14 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer">
            <input
              type="file"
              name="sound_image"
              placeholder="Sound image "
              onChange={(e) => onChangePicture({ e, type: "image" })}
              style={{ color: "transparent" }}
              className="form-control"
              accept="image/png,image/jpeg,image/jpg"
            />

            <div className="image_title">
              {" "}
              {imageName?.sound_image?.length > 17
                ? imageName?.sound_image.substring(0, 12) +
                  "..." +
                  imageName?.sound_image.substring(
                    imageName?.sound_image?.length - 5,
                    imageName?.sound_image?.length
                  )
                : imageName?.sound_image}
            </div>
          </div>
          <label
            htmlFor="floating_file"
            className="peer-focus:font-normal absolute text-sm text-[#000] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 left-0 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
          >
            Image<span className="text-red-500">*</span>
          </label>

          {soundImage?.url && !fileMsg?.identity_card && (
            <img
              src={
                soundImage?.url !== null
                  ? soundImage?.url
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
            />
          )}
          <ErrorMessage message={fileMsg?.sound_image} />
        </div>
      </>
    );
  };

  const AudioSide = () => {
    if (type === "edit" || type === "add") {
      return (
        <>
          {/* <img src={item?.image} alt='image' /> */}

          <div className="relative z-0   w-full group">
            <div className="block py-3 h-14 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer">
              <input
                type="file"
                name="sound_file"
                placeholder="Sound audio "
                style={{ color: "transparent" }}
                className="form-control"
                accept="audio/*"
                onChange={(e) => onChangePicture({ e, type: "audio" })}
              />
              <div className="image_title">
                {" "}
                {imageName?.sound_file?.length > 17
                  ? imageName?.sound_file.substring(0, 12) +
                    "..." +
                    imageName?.sound_file.substring(
                      imageName?.sound_file?.length - 5,
                      imageName?.sound_file?.length
                    )
                  : imageName?.sound_file}
              </div>
            </div>
            <label
              htmlFor="floating_file"
              className="peer-focus:font-normal absolute text-sm text-[#000] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 left-0 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              Sound<span className="text-red-500">*</span>
            </label>

            {soundAudio?.url && (
              <audio className="mt-5" controls>
                <source
                  src={soundAudio.url ? soundAudio.url : item?.sound}
                  type="audio/mp3"
                />
                Your browser does not support the audio element.
              </audio>
            )}

            <ErrorMessage message={fileMsg?.sound_file} />
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="md:py-4 sm:px-2 sm:py-8 px-7">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:min-w-[762px] ">
              <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold">
                  {type === "add" ? "Add" : "Edit"} Sound
                </h3>
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
                <div
                  className="relative p-6 flex-auto"
                  style={{ maxHeight: "650px", overflowY: "scroll" }}
                >
                  <div className="grid grid-cols-2">
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <OInputField
                        wrapperClassName="relative z-0  w-full group"
                        name="soundName"
                        inputLabel={
                          <>
                            Sound Name<span className="text-red-500">*</span>
                          </>
                        }
                        type="text"
                        autoFocus
                        maxLength={500}
                        onInput={(e) => preventMaxInput(e, 500)}
                        register={register(
                          "soundName",
                          formValidation.soundName
                        )}
                        errors={errors}
                        disable={type === "edit"}
                      />
                    </div>
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
                        wrapperClassName="relative z-0   w-full group"
                        type="text"
                        name="playlistName"
                        id="playlistName"
                        maxLength={500}
                        onInput={(e) => preventMaxInput(e, 500)}
                        inputLabel={
                          <>
                            Playlist Name<span className="text-red-500">*</span>
                          </>
                        }
                        register={register(
                          "playlistName",
                          formValidation.playlistName
                        )}
                        errors={errors}
                      />
                    </div>

                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <OInputField
                        wrapperClassName="relative z-0   w-full group"
                        type="text"
                        name="artistName"
                        id="artistName"
                        inputLabel={
                          <>
                            Artist's Name<span className="text-red-500">*</span>
                          </>
                        }
                        maxLength={500}
                        autoComplete="off"
                        onInput={(e) => preventMaxInput(e, 500)}
                        register={register(
                          "artistName",
                          formValidation.artistName
                        )}
                        errors={errors}
                      />
                    </div>

                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Widget Type<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="widgetId"
                        type="widgetId"
                        name="widgetId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder=" "
                        {...register("widgetId", {
                          required: "Please select widget type.",
                        })}
                      >
                        <option value="">Select widget Type</option>
                        {widget
                          ? widget?.map((val) => (
                              <option value={val?._id} key={val?._id}>
                                {val?.name}
                              </option>
                            ))
                          : null}
                      </select>

                      <ErrorMessage message={errors?.widgetId?.message} />
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
                        //preventDecimal
                        // isDecimal={true}
                        onInput={(e) => preventMaxInput(e, 5000)}
                        register={register("duration", formValidation.duration)}
                        errors={errors}
                      />
                    </div>

                    {/* <div className='grid grid-cols-1'> */}
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2 col-span-2">
                      <OTextArea
                        wrapperClassName="relative z-0  w-full group"
                        name="description"
                        inputLabel={<>Description</>}
                        type="text"
                        maxLength={15000}
                        onInput={(e) => preventMaxInput(e, 15000)}
                        register={register(
                          "description",
                          formValidation.description
                        )}
                      />
                    </div>
                    {/* </div> */}

                    {/* <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2 col-span-2">
                      <label
                        htmlFor="inputTag"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter keywords
                      </label>
                      <TagsInput
                        value={selected}
                        onChange={setSelected}
                        name="inputTag"
                        placeHolder="Enter keywords"
                      />
                      <em>Press enter to add new tag</em>
                    </div> */}

                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <ImageSide className="mt-4" />
                    </div>
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <AudioSide />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                    type="button"
                    onClick={onClose}
                  >
                    {t("O_BACK")}
                  </button>

                  {isLoading ? (
                    <div className="spinner-container bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                      <div className="loading-spinner" />
                    </div>
                  ) : (
                    <button
                      className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                      type="submit"
                      //onClick={() => fileValid()}
                    >
                      {" "}
                      {type === "add" ? "Add" : "Edit"}
                    </button>
                  )}
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

export default AddEditSound;
