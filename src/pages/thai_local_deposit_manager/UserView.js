import OImage from "components/reusable/OImage";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import defaultImage from "../../assets/images/No-image-found.jpg";
import { HiBadgeCheck } from "react-icons/hi";
import checkIcon from "../../assets/images/check.png";
import { startCase } from "lodash";
import { IoArrowBackSharp } from "react-icons/io5";

const UserView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [item] = useState(location.state);
  const [age, setAge] = useState(null);

  const calculateAge = () => {
    const dobDate = new Date(item?.dob);
    const today = new Date();
    let ageDiff = today.getFullYear() - dobDate.getFullYear();
    setAge(item?.dob ? ageDiff : "");
  };

  useEffect(() => {
    calculateAge();
  }, []);

  return (
    <>
      <div className="p-5 dark:bg-slate-900">
        <Link to="/users" className="mb-5 ml-4 block">
          <IoArrowBackSharp />
        </Link>
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

        <div className="flex">
          <figure className="inline-block overflow-hidden rounded-full border border-2 mb-5">
            <OImage
              src={item?.profilePic || defaultImage}
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
                <strong>{t("O_USER_ID")}: </strong>
                {item?.userId || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("UPLOADED_ID")}: </strong>
                {item?.verificationStatus === "pending" ? (
                  <a href={item?.verificationDetails?.image}>Click Here To View</a>
                ) : (
                  "N/A"
                )}
              </li>
              <li className="mb-3">
                <strong>{t("NICKNAME")}: </strong>
                {startCase(item?.nickName || "")}
              </li>
              <li className="mb-3">
                <strong>{t("O_MOBILE_NUMBER")} : </strong> {"+"}{" "}
                {item?.countryCode} {item?.mobile || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("REGISTERED_DATE")}: </strong>{" "}
                {dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A") || "N/A"}{" "}
              </li>
            </ul>
          </div>

          <div>
            <ul>
              <li className="mb-3">
                <strong> {t("COUNTRY")}: </strong>
                {item?.country || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("GENDER")}: </strong>
                {startCase(item?.gender) || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("USER_DOB")}: </strong>
                {item?.dob ? (
                  <>{dayjs(item?.dob).format("DD MMMM YYYY") || "N/A"}</>
                ) : (
                  "N/A"
                )}
              </li>
              <li className="mb-3 mr-2">
                <strong>{t("INTERESTS")}: </strong>
                {item?.tags.map(element=>element?.name)?.join(', ') || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("MOVE_HEAD")}: </strong>
                {item?.verificationStatus === "pending" ? (
                  <a href={item?.verificationDetails?.video}>Click Here</a>
                ) : (
                  ""
                )}
                {/* {item?.verificationDetails
                  ? startCase(item?.verificationDetails?.video)
                  : "" || "N/A"} */}
              </li>
            </ul>
          </div>

          <div>
            <ul>
              <li className="mb-3">
                <strong>{t("O_AGE")}: </strong>
                {age && (
                  <>
                    {age} {age === 1 ? "year" : "years"}
                  </>
                )}
              </li>
              <li className="mb-3">
                <strong> {t("USER_SUBSCRIPTION")}: </strong>
                {startCase(item?.subscription) || "N/A"}
              </li>
              <li className="mb-3">
                <strong> {t("O_VERIFICATION")}: </strong>
                {startCase(item?.verificationStatus) || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("REGISTRATION_VIA")}: </strong>
                {startCase(item?.registrationType) || "N/A"}
              </li>
              <li className="mb-3">
                <strong>{t("SUPER_LIKE")}: </strong>
                {item?.superLike || 0}
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="opacity-25 fixed inset-0 z-40 bg-black" /> */}
    </>
  );
};

export default UserView;
