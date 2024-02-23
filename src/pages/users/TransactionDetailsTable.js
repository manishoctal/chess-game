import { isEmpty, startCase } from "lodash";
import { useTranslation } from "react-i18next";
import helpers from "utils/helpers";
import QRCodeGenerator from "components/QRCodeGenerator";
import ViewImage from "pages/reports_manager/ViewImage";
import { useState } from "react";

const TransactionDetailsTable = ({
  transactions,
  page,
  userType,
  pageSize,
}) => {
  const { t } = useTranslation();
  const [viewShowModal, setViewShowModal] = useState(false);
  const [imageView, setImageView] = useState("");

  const handleUserView = (element, type) => {
    setImageView({ image: element, type });
    setViewShowModal(true);
  };
  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-3">
                {" "}
                {t("S.NO")}{" "}
              </th>
              <th scope="col" className="py-3 px-6">
                {" "}
                {t("Name of the Thai Local")}{" "}
              </th>
              <th scope="col" className="py-3 px-6">
                {" "}
                {t("Account Balance")}{" "}
              </th>
              {userType === "tourist" && (
                <>
                  <th scope="col" className="py-3 px-6 text-left">
                    {" "}
                    {t("Reference no.")}{" "}
                  </th>
                  <th scope="col" className="py-3 px-3">
                    {" "}
                    {t("Total payment")}{" "}
                  </th>
                </>
              )}
              {userType === "local" && (
                <>
                  <th scope="col" className="py-3 px-6 text-left">
                    {" "}
                    {t("AMOUNT_PAID")}{" "}
                  </th>
                  <th scope="col" className="py-3 px-3">
                    {" "}
                    {t("THAI_LOCAL_REWARD")}{" "}
                  </th>
                </>
              )}
              <th scope="col" className="py-3 px-6 text-left">
                {" "}
                {t("Name of the foreign tourist")}{" "}
              </th>
              <th scope="col" className="py-3 px-3">
                {" "}
                {t("Date of Request")}{" "}
              </th>
              <th scope="col" className="py-3 px-3">
                {" "}
                {t("QR Image received time")}{" "}
              </th>
              <th scope="col" className="py-3 px-3">
                {" "}
                {t("payment receipt proof time")}{" "}
              </th>
              <th scope="col" className="py-3 px-3">
                {" "}
                {t("Durations (In Seconds)")}{" "}
              </th>
              <th scope="col" className="py-3 px-3">
                {" "}
                {t("QR_CODE")}{" "}
              </th>
              <th scope="col" className="py-3 px-3">
                {" "}
                {t("PAYMENT_PROOF_BANK")}{" "}
              </th>
              <th scope="col" className="py-3 px-3">
                {" "}
                {t("O_STATUS")}{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length > 0 &&
              transactions?.map((item, i) => (
                <tr
                  key={i}
                  className="bg-white border-b dark:bg-gray-800 dark:border-[#ffffff38]"
                >
                  <th
                    scope="row"
                    className="py-4 px-3 border-r font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]"
                  >
                    {i + 1 + pageSize * (page - 1)}
                  </th>
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.ternaryCondition(
                      item?.local?.firstName,
                      item?.local?.firstName,
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.formattedAmount(item?.local?.walletAmount)}
                  </td>
                  {userType === "tourist" && (
                    <>
                      <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                        {helpers.ternaryCondition(
                          item?.referenceNumber,
                          item?.referenceNumber,
                          "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                        {helpers.formattedAmount(item?.amount)}
                      </td>
                    </>
                  )}
                  {userType === "local" && (
                    <>
                      <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                        {helpers.formattedAmount(item?.amount)}
                      </td>
                      <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                        {helpers.formattedAmount(item?.local?.rewardAmount)}
                      </td>
                    </>
                  )}
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.ternaryCondition(
                      item?.tourist?.firstName,
                      item?.tourist?.firstName,
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.ternaryCondition(
                      item?.createdAt,
                      helpers.getDateAndTime(item?.createdAt),
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.ternaryCondition(
                      item?.acceptedAt,
                      helpers.getDateAndTime(item?.createdAt),
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.ternaryCondition(
                      item?.completedAt,
                      helpers.getDateAndTime(item?.completedAt),
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.getSeconds(item?.createdAt, item?.acceptedAt) ??
                      "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center  ">
                    <button
                      type="button"
                      onClick={() => handleUserView(item?.qrCodeString, "QR")}
                    >
                      <QRCodeGenerator qrCodeValue={item.qrCodeString} />
                    </button>
                  </td>

                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.ternaryCondition(
                      item?.paymentProof,
                      <button
                        type="button"
                        onClick={() =>
                          handleUserView(item?.paymentProof, "image")
                        }
                      >
                        <img
                          src={item?.paymentProof}
                          alt=""
                          className="h-[70px] w-[70px] object-cover"
                        />
                      </button>,
                      "NA"
                    )}
                  </td>
                  <td className="py-2 px-4 border-r  dark:border-[#ffffff38] text-center">
                    {helpers.ternaryCondition(
                      startCase(item?.status),
                      startCase(item?.status),
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            {isEmpty(transactions) ? (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td
                  className="py-2 px-4 border-r dark:border-[#ffffff38]"
                  colSpan={14}
                >
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {viewShowModal && (
        <ViewImage setViewShowModal={setViewShowModal} item={imageView} />
      )}
    </div>
  );
};

export default TransactionDetailsTable;
