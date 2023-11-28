import ErrorMessage from "../../components/ErrorMessage";
import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiGet, apiPut } from "../../utils/apiFetch";
import pathObj from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import DynamicLabel from "utils/DynamicLabel";

const Settings = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {},
  });
  const [settingChangeLoading, setSettingChangeLoading] = useState(false);
  const notification = useToastContext();
  const manager =
    user?.permission?.find((e) => e.manager === "setting_manager") ?? {};

  const handleSubmitForm = async (data) => {
    try {
      setSettingChangeLoading(true);
      const res = await apiPut(pathObj.updateSettings, data);
      if (res.data.success === true) {
        notification.success(res?.data?.message);
      } else {
        notification.error(res?.data?.message);
      }
    } catch (err) {
      console.log("err:", err);
    } finally {
      setSettingChangeLoading(false);
    }
  };

  const updateSettings = async () => {
    try {
      const res = await apiGet(pathObj.updateSettings);
      if (res) {
        reset(res?.data?.results);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  useEffect(() => {
    updateSettings();
  }, []);

  return (
    <section className="">
      <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
        <section className="sm:px-8 px-4 py-4 dark:bg-slate-900">
          <div className="border xl:w-full round dark:border-[#ffffff38]">
            <div className="bg-white py-6 px-4  rounded-b-md dark:bg-slate-800 ">
              {/* <main className='justify-center flex flex-wrap xl:[&>*]:mr-14 sm:[&>*]:mr-7 2xl:[&>*]:mr-14  sm:px-0 px-4 xl:[&>*]:w-3/12 sm:[&>*]:w-3/5 '> */}
              <main className="">
                <div className="grid grid-cols-2 gap-4 gap-x-6">
                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("BLOCK_USER")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("O_PROFILE")} type={true} />

                        <div className="flex border rounded">
                          <input
                            name="reportUser"
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="reportUser"
                            {...register("reportUser", {
                              required: {
                                value: true,
                                message: "Please enter report of profile",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage message={errors?.reportUser?.message} />
                      </div>
                      <div>
                        <DynamicLabel name={t("O_POSTS")} type={true} />

                        <div className="flex border rounded">
                          <input
                            name="reportPost"
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="reportPost"
                            {...register("reportPost", {
                              required: {
                                value: true,
                                message: "Please enter posts",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage message={errors?.reportPost?.message} />
                      </div>
                      <div>
                        <DynamicLabel name={t("O_VIDEO")} type={true} />

                        <div className="flex border rounded">
                          <input
                            name="reportVideo"
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="reportVideo"
                            {...register("reportVideo", {
                              required: {
                                value: true,
                                message: "Please enter report of video",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage message={errors?.reportVideo?.message} />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("VIDEO_UPLOAD_TIME")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("MIN_SEC")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="videoUploadMinTime"
                            {...register("videoUploadMinTime", {
                              required: {
                                value: true,
                                message: "Please enter minimum time",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.videoUploadMinTime?.message}
                        />
                      </div>
                      <div>
                        <DynamicLabel name={t("MAX_SEC")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="videoUploadMaxTime"
                            {...register("videoUploadMaxTime", {
                              required: {
                                value: true,
                                message: "Please enter maximum time",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.videoUploadMaxTime?.message}
                        />
                      </div>
                    </div>
                  </div>

                  {/* additional-integration  */}

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("VIDEO_CALL")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("ENTER_NO_SECOND")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="videoUploadMinTime"
                            {...register("videoUploadMinTime", {
                              required: {
                                value: true,
                                message: "Please enter minimum time",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.videoUploadMinTime?.message}
                        />
                      </div>
                      <div>
                        <DynamicLabel name={t("ENTER_NO_COIN")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="videoUploadMaxTime"
                            {...register("videoUploadMaxTime", {
                              required: {
                                value: true,
                                message: "Please enter maximum time",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.videoUploadMaxTime?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("VOICE_NOTE")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("ENTER_NO_SECOND")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="voiceNoteSecond"
                            {...register("voiceNoteSecond", {
                              required: {
                                value: true,
                                message: "Please enter voice note second",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.voiceNoteSecond?.message}
                        />
                      </div>
                      <div>
                        <DynamicLabel name={t("ENTER_NO_COIN")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="voiceNoteCoins"
                            {...register("voiceNoteCoins", {
                              required: {
                                value: true,
                                message: "Please enter voice note coins",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.voiceNoteCoins?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("VOICE_CALL")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("ENTER_NO_SECOND")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="voiceCallSecond"
                            {...register("voiceCallSecond", {
                              required: {
                                value: true,
                                message: "Please enter voice call second",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.voiceCallSecond?.message}
                        />
                      </div>
                      <div>
                        <DynamicLabel name={t("ENTER_NO_COIN")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="voiceCallCoins"
                            {...register("voiceCallCoins", {
                              required: {
                                value: true,
                                message: "Please enter voice call coins no.",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.voiceCallCoins?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("LIVE_STREAMING")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("ENTER_NO_SECOND")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="liveStreamSecond"
                            {...register("liveStreamSecond", {
                              required: {
                                value: true,
                                message:
                                  "Please enter live stream no of second",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.liveStreamSecond?.message}
                        />
                      </div>
                      <div>
                        <DynamicLabel name={t("ENTER_NO_COIN")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="liveStreamCoins"
                            {...register("liveStreamCoins", {
                              required: {
                                value: true,
                                message: "Please enter live stream coins",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.liveStreamCoins?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("IMAGE_CHAT")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("ENTER_NO_IMAGE")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="chatImage"
                            {...register("chatImage", {
                              required: {
                                value: true,
                                message: "Please enter chat image no.",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage message={errors?.chatImage?.message} />
                      </div>
                      <div>
                        <DynamicLabel name={t("ENTER_NO_COIN")} type={true} />
                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="chatImageCoins"
                            {...register("chatImageCoins", {
                              required: {
                                value: true,
                                message: "Please enter chat coins",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.chatImageCoins?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("CHAT")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("CHAT_NO")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="chatCharacter"
                            {...register("chatCharacter", {
                              required: {
                                value: true,
                                message: "Please enter number of chat.",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.chatCharacter?.message}
                        />
                      </div>
                      <div>
                        <DynamicLabel name={t("ENTER_NO_COIN")} type={true} />
                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="chatCoins"
                            {...register("chatCoins", {
                              required: {
                                value: true,
                                message: "Please enter chat coins",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage message={errors?.chatCoins?.message} />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("VIDEO_CHAT")}
                    </label>

                    <div className="grid grid-cols-3 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("ENTER_NO_VIDEO")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="chatVideo"
                            {...register("chatVideo", {
                              required: {
                                value: true,
                                message: "Please enter video no.",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage message={errors?.chatVideo?.message} />
                      </div>
                      <div>
                        <DynamicLabel name={t("ENTER_NO_COIN")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="chatVideoCoins"
                            {...register("chatVideoCoins", {
                              required: {
                                value: true,
                                message: "Please enter chat video coins",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.chatVideoCoins?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("FREE_STREAMING_TIME")}
                    </label>

                    <div className="grid grid-cols-2 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("ENTER_TIME")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="freeStream"
                            {...register("freeStream", {
                              required: {
                                value: true,
                                message: "Please enter free stream time.",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage message={errors?.freeStream?.message} />
                      </div>
                    </div>
                  </div>

                  {/* additional-integration  */}

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("SIGN_UP_COIN")}
                    </label>

                    <div className="grid grid-cols-2 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("FREE_COIN")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="signUpCoins"
                            {...register("signUpCoins", {
                              required: {
                                value: true,
                                message: "Please enter signup coins",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage message={errors?.signUpCoins?.message} />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 text-xl font-medium mb-4 dark:text-white">
                      {t("REFER_FRIEND")}
                    </label>

                    <div className="grid grid-cols-2 gap-x-5 border p-4 dark:border-[#ffffff38]">
                      <div className="">
                        <DynamicLabel name={t("NO_OF_COIN")} type={true} />

                        <div className="flex border rounded">
                          <input
                            className="border-white dark:border-[#ffffff38] dark:bg-gray-800 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            // onInput={(e) => preventMax(e)}
                            onKeyDown={(event) => {
                              if (
                                !["Backspace", "Delete", "Tab"].includes(
                                  event.key
                                ) &&
                                !/[0-9]/.test(event.key)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            id="referralCoins"
                            {...register("referralCoins", {
                              required: {
                                value: true,
                                message: "Please enter referral coins",
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Decimals not allowed.",
                              },
                              min: {
                                value: 1,
                                message: "Minimum value must is 1.",
                              },
                              // max: {
                              //   value: 100,
                              //   message: "Maximum value must is 100.",
                              // },
                            })}
                            placeholder=" "
                          />
                        </div>
                        <ErrorMessage
                          message={errors?.referralCoins?.message}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </section>

        {(manager?.add || user?.role === "admin") && (
          <div className="mt-4 text-center">
            {settingChangeLoading &&
            (user?.permission?.[17]?.add || user.permission?.length === 0) ? (
              <div
                className="max-w-[100px] block spinner-container bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                style={{ margin: "0 auto" }}
              >
                <div className="loading-spinner" />
              </div>
            ) : (
              <div>
              <button
                className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                type="submit"
              >
                {t("O_UPDATE")}
              </button>
              </div>
            )}
          </div>
        )}
      </form>
    </section>
  );
};

export default Settings;
