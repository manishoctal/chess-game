import React from "react";
import timeIcon from "../../../assets/icons/icon/time.svg";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import defaultImage from "../../../assets/images/No-image-found.jpg";
import { startCase, capitalize } from "lodash";
import helpers from "utils/helpers";
import refferalCodeIcon from "../../../assets/icons/icon/refferalCode.svg";
import genderIcon from "../../../assets/icons/icon/gender.svg";
import dobIcon from "../../../assets/icons/icon/dob.svg";
import upcCodeIcon from "../../../assets/icons/icon/upcCode.svg";
import locationIcon from "../../../assets/icons/icon/location.svg";
import cityIcon from "../../../assets/icons/icon/city.svg";
import buildingIcon from "../../../assets/icons/icon/building.svg";
import bonusIcon from "../../../assets/icons/icon/bonus.svg";
import OImage from "components/reusable/OImage";

const UserDetail = ({
  item,
  handleShowImage,
  renderApprovalStatus,
  kycSection,
}) => {
  const { t } = useTranslation();

  const visitedCities = () => {
    return item?.visitedCities && item.visitedCities.length > 0
      ? item.visitedCities.map((city, key) => city).join(", ")
      : "N/A";
  };

  const planningCities = () => {
    return item?.planningCities && item?.planningCities?.length > 0
      ? item.planningCities.map((city, key) => city).join(", ")
      : "N/A";
  };

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="border border-1 border-[#E1DEDE] rounded-md p-6 ps-3">
        <ul>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={timeIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("REGISTERED_DATE")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {helpers.ternaryCondition(
                      item?.createdAt,
                      dayjs(item?.createdAt).format("DD-MM-YYYY hh:mm A"),
                      "N/A"
                    )}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={refferalCodeIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("USERS_REFERRAL_CODE")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {helpers.ternaryCondition(
                      item?.referralCode,
                      item?.referralCode,
                      "N/A"
                    )}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={genderIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("GENDER")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {helpers.ternaryCondition(
                      item?.gender,
                      startCase(item?.gender),
                      "N/A"
                    )}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={dobIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("USER_DOB")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {helpers.ternaryCondition(
                      item?.dob,
                      dayjs(item?.dob).format("D MMM YYYY"),
                      "N/A"
                    )}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={upcCodeIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("UPC_CODE")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {helpers.ternaryCondition(
                      item?.upcCode,
                      item?.upcCode,
                      "N/A"
                    )}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
        </ul>
      </div>
      <div className="border border-1 border-[#E1DEDE] rounded-md p-6 ps-3">
        <ul>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={locationIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("NATIONALITY")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {helpers.ternaryCondition(
                      item?.nationality,
                      item?.nationality,
                      "N/A"
                    )}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={cityIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("COUNTRY_OF_LIVING")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {helpers.ternaryCondition(
                      item?.countryData,
                      startCase(item?.countryData),
                      "N/A"
                    )}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={buildingIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("CITIES_VISITED_IN_THAILAND")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {visitedCities()}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={buildingIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("CITIES_GOING_TO_VISIT_IN_THAILAND")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {planningCities()}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
          <div>
            <li className="mb-4">
              <div className="flex items-center">
                <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={bonusIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5C5C5C] dark:text-white">
                    {t("BONUS_AMOUNT")}
                  </span>
                  <strong className="dark:text-slate-400">
                    {item?.bonusAmount || 0}
                  </strong>
                </figcaption>
              </div>
            </li>
          </div>
        </ul>
      </div>
      <div className="border border-1 border-[#E1DEDE] rounded-md p-12">
        <span className="block text-center pb-3 dark:text-white">
          {t("KYC_DOCUMENT")}
        </span>
        <div className="relative">
          <figure className="inline-block overflow-hidden border mb-3 w-full h-[200px]">
            <OImage
              src={item?.kycRecord?.docImageFront || defaultImage}
              className="w-full h-full object-contain inline cursor-pointer"
              alt=""
              onClick={() => handleShowImage(item?.kycRecord?.docImageFront)}
              fallbackUrl={defaultImage}
            />
          </figure>
          {renderApprovalStatus()}
        </div>
        <div className="relative">
          <figure className="inline-block overflow-hidden border mb-3 w-full h-[200px]">
            <OImage
              src={item?.kycRecord?.docImageBack || defaultImage}
              className="w-full h-full object-contain inline cursor-pointer"
              alt=""
              onClick={() => handleShowImage(item?.kycRecord?.docImageBack)}
              fallbackUrl={defaultImage}
            />
          </figure>
          {renderApprovalStatus()}
        </div>
        <span className="block text-center dark:text-white">
          {t("DOCUMENT_NUMBER")}:{" "}
          <b>
            {helpers.ternaryCondition(
              item?.kycRecord?.docNumber,
              item?.kycRecord?.docNumber,
              "N/A"
            )}
          </b>
        </span>
        {kycSection}
        <span className="block text-center mt-4 dark:text-white">
          {t("KYC_STATUS")}:{" "}
          <b>
            {helpers.ternaryCondition(
              item?.kycRecord?.isApproved,
              capitalize(startCase(item?.kycRecord?.isApproved)),
              "Kyc not uploaded yet"
            )}
          </b>
        </span>
      </div>
    </div>
  );
};

export default UserDetail;
