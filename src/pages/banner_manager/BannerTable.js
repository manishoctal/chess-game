import React, { useContext, useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import helpers from "../../utils/helpers";
import OImage from "components/reusable/OImage";
import OBannerTableHead from "../../components/reusable/OTableHead";
import { apiPost } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import useToastContext from "hooks/useToastContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import movePng from "../../assets/images/move.png";

const BannerTable = ({ setAllBanner, handelDelete, page, sort, setSort, manager, handelStatusChange, pageSize, editViewBanner, bannerData, getAllFAQ, bannerStatus }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const { user, updatePageName } = useContext(AuthContext);
  useEffect(() => {
    updatePageName(t("SUB_ADMIN_MANAGERS"));
  }, []);

  const sequenceSort = async (payload) => {
    const sequence = payload?.map((element) => {
      return {
        _id: element._id,
        sequence: element?.sequence,
        title: element?.title,
      };
    });

    try {
      const reOrderResult = await apiPost(apiPath.reOrderBanner, {
        sequence: sequence,
      });
      if (reOrderResult?.data?.success) {
        notification.success(reOrderResult?.data?.message);
        getAllFAQ();
      }
    } catch (error) {
      console.error("error in get all FAQs list==>>>>", error.message);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedItems = [...bannerData];
    const [movedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, movedItem);
    const updatedSequence = updatedItems.map((element, index) => {
      return { ...element, sequence: index + 1 };
    });
    setAllBanner(updatedSequence);
    sequenceSort(updatedSequence);
  };
  const [firstId, setFirstId] = useState();

  useEffect(() => {
    if (bannerData?.length > 0) {
      setFirstId(bannerData[0]?.id);
    }
  }, [bannerData]);

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <DragDropContext onDragEnd={onDragEnd}>
          <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
              <tr>
                <th scope="col" className="py-3 px-6 text-center">
                  {t("DRAG_ROW")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("S.NO")}
                </th>
                <OBannerTableHead sort={sort} setSort={setSort} name="BANNER_ID" fieldName="bannerId" classTd={"justify-center"} />
                <th scope="col" className="py-3 px-6 flex justify-center">
                  {t("BANNER_IMAGE")}
                </th>
                <OBannerTableHead sort={sort} setSort={setSort} name="UPLOADED_DATE" fieldName="createdAt" classTd={"justify-center"} />
                {(manager?.add || manager?.edit || user?.role === "admin") && <OBannerTableHead sort={sort} setSort={setSort} name="O_STATUS" fieldName="status" classTd={"justify-center"} />}
                <th scope="col" className="py-3 px-6 text-center">
                  {t("O_ACTION")}
                </th>
              </tr>
            </thead>
            <Droppable droppableId={firstId}>
              {(provided) => (
                <tbody ref={provided?.innerRef} {...provided?.droppableProps}>
                  {bannerData?.map((item, i) => (
                    <Draggable key={item?.id} draggableId={item?.id} index={i}>
                      {(provides) => (
                        <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" ref={provides?.innerRef} {...provides?.draggableProps} {...provides?.dragHandleProps}>
                          <td className="py-4 px-6 border-r h-4 w-4">
                            <img src={movePng} alt="" style={{ height: "20px" }} />
                          </td>
                          <th scope="row" className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white">
                            {i + 1 + pageSize * (page - 1)}
                          </th>

                          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{startCase(item?.bannerId) || "N/A"}</td>

                          <td className="py-2 px-4 border-r dark:border-[#ffffff38] flex justify-center">
                            <ul>
                              <li
                                onClick={() => {
                                  editViewBanner("view", item);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <OImage src={item?.image ? item?.image : null} fallbackUrl="/images/user.png" className="w-16 h-10" alt="" />
                              </li>
                            </ul>
                          </td>
                          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers.getDateAndTime(item?.createdAt)}</td>
                          {(manager?.add || manager?.edit || user?.role === "admin") && (
                            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                              <label
                                className={`inline-flex relative items-center ${item?.status === "inactive" && bannerStatus?.activeBannerCount >= 5 ? "cursor-not-allowed" : "cursor-pointer"}`}
                                title={`${item?.status === "active" ? "Active" : "Inactive"}`}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={item?.status === "active"}
                                  disabled={item?.status === "inactive" && bannerStatus?.activeBannerCount >= 5}
                                  onChange={(e) => helpers.alertFunction(`${t("ARE_YOU_SURE_YOU_WANT_TO")} ${e.target.checked ? "active" : "inactive"} banner ID '${item?.bannerId}'?`, item, handelStatusChange)}
                                />
                                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                              </label>
                            </td>
                          )}

                          <td className="py-2 px-4 border-l">
                            <div className="">
                              <ul className="flex justify-center">
                                <li
                                  onClick={() => {
                                    editViewBanner("view", item);
                                  }}
                                  className="px-2 py-2 hover:text-gradientTo"
                                >
                                  <a title={t("O_VIEW")}>
                                    <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                                  </a>
                                </li>
                                {(manager?.add || user?.role === "admin") && (
                                  <li
                                    onClick={() => {
                                      editViewBanner("edit", item);
                                    }}
                                    className="px-2 py-2 hover:text-gradientTo"
                                  >
                                    <a title={t("O_EDIT")}>
                                      <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                                    </a>
                                  </li>
                                )}

                                {(manager?.add || user?.role === "admin") && (
                                  <li
                                    onClick={(e) =>
                                      helpers.alertFunction(
                                        `${t("ARE_YOU_SURE_YOU_WANT_TO")} delete banner ID
                             '${item?.bannerId}'?`,
                                        item,
                                        handelDelete
                                      )
                                    }
                                    className="px-2 py-2 hover:text-gradientTo"
                                  >
                                    <a title={t("O_DELETE")}>
                                      <AiFillDelete className="cursor-pointer w-5 h-5 text-red-600" />
                                    </a>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}

                  {isEmpty(bannerData) ? (
                    <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-4 px-6" colSpan={9}>
                        {t("O_NO_RECORD_FOUND")}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BannerTable;
