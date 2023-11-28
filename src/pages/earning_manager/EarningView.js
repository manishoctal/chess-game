import OImage from "components/reusable/OImage";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import defaultImage from "../../assets/images/No-image-found.jpg";
import { HiBadgeCheck } from "react-icons/hi";
import checkIcon from "../../assets/images/check.png";
import { startCase } from "lodash";

const EarningView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [item] = useState(location.state);
  console.log("location", location.state);
  return (
    <>
      <div className="p-5 dark:bg-slate-900">
        {/* <div className="mb-5 flex justify-between">

          <div className="flex mb-5">
            <button className="bg-gradientTo flex text-sm px-8 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap">
              {t("VERIFIED")}
            </button>
            <button className="bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap">
              {t("O_ACTIVE")}
            </button>
          </div>
        </div> */}

        <label className="mb-3 block">
          <strong>{t("UPLOAD_IMAGE")}</strong>
        </label>

        <div className="flex">
          <figure className="inline-block overflow-hidden rounded-full border border-2 mb-5">
            <OImage
              src={item?.image || defaultImage}
              className="w-[100px] h-[100px] inline"
              alt=""
            />
          </figure>
          {item?.verificationStatus === "verified" && (
            <span>
              <img
                src={item?.verificationStatus === "verified" && checkIcon}
                alt=""
              />
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 dark:text-white">
          <div>
            <ul>
              <li className="mb-3">
                {" "}
                <strong>{t("GIFT_NAME")}: </strong>
                {startCase(item?.name) || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("COINS_CONSISTING")}: </strong>
                {item?.coins ?? ""}
              </li>
              <li className="mb-3">
                <strong>{t("CATEGORY_N")}: </strong>
                {item?.category[0]?.name || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("TAKEN_DATE")}: </strong>{" "}
                {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A") || "N/A"}{" "}
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="opacity-25 fixed inset-0 z-40 bg-black" /> */}
    </>
  );
};

export default EarningView;
