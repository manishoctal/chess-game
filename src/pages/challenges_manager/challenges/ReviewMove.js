import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { apiGet } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import { Chessboard } from "react-chessboard";
import { AiFillEye } from "react-icons/ai";

const ReviewMove = () => {
  const [fen, setFen] = useState("");
  const location = useLocation();
  const { t } = useTranslation();
  const [move, setMove] = useState([]);
  const { logoutUser } = useContext(AuthContext);

  const getMoves = async () => {

    try {
      const path = `${apiPath.challengeManager}/review?challengeId=${location?.state?.id}`;
      const result = await apiGet(path);
      if (result?.data?.success) {
        setMove(result?.data?.results);

        setFen(result?.data?.results[0]?.move?.fen);
      }
    } catch (error) {
      console.error("error ", error);
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  console.log("move", move);

  useEffect(() => {
    getMoves();
  }, [location?.state]);

  return (
    move&&fen&&
    <>
      <div className="p-6">
        <div className="flex active mb-5 ml-4 ">
          <Link aria-current="page" className="" to={-1}>
            <FaCircleArrowLeft size={27} />
          </Link>
        </div>

        <div className="grid grid-cols-2">
          {fen && <Chessboard position={fen} boardWidth={600} arePiecesDraggable={false}/>}

          <div className="px-4 max-h-[600px] overflow-y-auto">
            <table className="border w-full text-start">
              <thead>
                <tr>
                  <th className="text-start bg-[#f1f1f1] px-2 py-3 border border-[#ddd] text-sm">
                    {t("S.NO")}
                  </th>
                  <th className="text-start bg-[#f1f1f1] px-2 py-3 border border-[#ddd] text-sm">
                    {t("O_FROM_MOVE")}
                  </th>
                  <th className="text-start bg-[#f1f1f1] px-2 py-3 border border-[#ddd] text-sm">
                    {t("O_TO_MOVE")}
                  </th>
                  <th className="text-start bg-[#f1f1f1] px-2 py-3 border border-[#ddd] text-sm">
                    {t("TRANSACTION_USER_NAME")}
                  </th>
                  <th className="text-start bg-[#f1f1f1] px-2 py-3 border border-[#ddd] text-sm">
                    {t("O_ACTION")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {move?.map((item, i) => (
                  <tr key={item?._id}>
                    <td className="text-start bg-[#fff] px-2 py-3 text-sm border">
                      {i + 1}
                    </td>
                    <td className="text-start bg-[#fff] px-2 py-3 text-sm border">
                      {item?.move?.from}
                    </td>
                    <td className="text-start bg-[#fff] px-2 py-3 text-sm border">
                      {item?.move?.to}
                    </td>
                    <td className="text-start bg-[#fff] px-2 py-3 text-sm border">
                      {item?.user?.fullName}
                    </td>
                    <td className="text-start bg-[#fff] px-2 py-3 text-sm border">
                      <AiFillEye
                        className="cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white hover:text-blue-700"
                        onClick={() => setFen(item?.move?.fen)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
    
  );
};

export default ReviewMove;
