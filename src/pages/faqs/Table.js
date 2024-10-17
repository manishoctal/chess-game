import React, { useContext, useEffect, useState } from "react";
import { apiPut, apiDelete, apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { isEmpty } from "lodash";
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import AuthContext from "context/AuthContext";
import { useTranslation } from "react-i18next";
import useToastContext from "hooks/useToastContext";
import helpers from "../../utils/helpers";
import OFaqTableHead from "../../components/reusable/OTableHead";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import movePng from "../../assets/images/move.png";

const Table = ({ FAQs, getAllFAQ, handelEdit, paginationObj, manager, pageSize, sort, setSort, setFAQS }) => {

  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const notification = useToastContext();

  // change status of faq function start
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
        type: "faq",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result?.data?.message);
        getAllFAQ();
      }
    } catch (error) {
      console.error("error in get all faqs list==>>>>", error.message);
    }
  };
  // change status of faq function end

  // delete faq function start

  const handelDelete = async (item) => {
    try {
      const path = apiPath.getFAQs + "/" + item?._id;
      const result = await apiDelete(path);
      if (result?.status === 200) {
        notification.success(result?.data.message);
        getAllFAQ({ deletePage: 1 });
      }
    } catch (error) {
      console.error("error in get all FAQs list==>>>>", error.message);
    }
  };
  // delete faq function end

  const sequenceSort = async (payload) => {
    const sequence = payload?.map((element) => {
      return {
        _id: element._id,
        sequence: element?.sequence,
        title: element?.title,
      };
    });

    try {
      const reOrderResult = await apiPost(apiPath.reOrderFaq, {
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

    const updatedItems = [...FAQs];
    const [movedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, movedItem);
    const updatedSequence = updatedItems.map((element, index) => {
      return { ...element, sequence: index + 1 };
    });
    setFAQS(updatedSequence);
    sequenceSort(updatedSequence);
  };
  const [firstId, setFirstId] = useState();
  useEffect(() => {
    if (FAQs?.length > 0) {
      setFirstId(FAQs[0]?.id);
    }
  }, [FAQs]);

  return (
    <div className="p-3">
      <span className="italic text-xs text-left pl-2 text-[#A5A5A5] dark:text-gray-200">Note:You can reorder FAQs rows by dragging and dropping them.</span>
      <div className="overflow-x-auto relative rounded-lg border">
        <DragDropContext onDragEnd={onDragEnd}>
          <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
            <thead className="text-xs text-gray-900 border border-[#E1E6EE]  bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6 text-center">
                  {t("DRAG_ROW")}
                </th>
                <th scope="col" className="py-3 px-6 text-center">
                  {t("S.NO")}
                </th>
                <OFaqTableHead sort={sort} setSort={setSort} name="FAQS_TITLE" fieldName="title" classTd={"justify-center "} />
                <OFaqTableHead sort={sort} setSort={setSort} name="O_CREATED_AT" fieldName="createdAt" classTd={"justify-center"} />
                <OFaqTableHead sort={sort} setSort={setSort} name="O_UPDATED_AT" fieldName="updatedAt" classTd={"justify-center"} />
                {(manager?.add || user?.role === "admin") && <OFaqTableHead sort={sort} setSort={setSort} name="O_STATUS" fieldName="status" classTd={"justify-center"} />}
                <th scope="col" className="py-3 px-6 text-center">
                  {t("O_ACTION")}
                </th>
              </tr>
            </thead>
            <Droppable droppableId={firstId}>
              {(provided) => (
                <tbody ref={provided?.innerRef} {...provided?.droppableProps}>
                  {FAQs?.map((item, i) => (
                    <Draggable key={item?.id} draggableId={item?.id} index={i}>
                      {(provides) => (
                        <tr key={item?._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" ref={provides?.innerRef} {...provides?.draggableProps} {...provides?.dragHandleProps}>
                          <td className="py-4 px-6 border-r h-4 w-4">
                            <img src={movePng} alt="" style={{ height: "20px" }} />
                          </td>
                          <th scope="row" className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white text-center">
                            {i + 1 + pageSize * (paginationObj?.page - 1)}
                          </th>
                          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers.orOperator((item?.title), "N/A")}</td>
                          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers.getDateAndTime(item?.createdAt)}</td>
                          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers.getDateAndTime(item?.updatedAt)}</td>
                          {(manager?.add || user?.role === "admin") && (
                            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                              <label className="inline-flex relative items-center cursor-pointer" title={`${item?.status === "active" ? "Active" : "Inactive"}`}>
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={item?.status === "active"}
                                  onChange={(e) => helpers.alertFunction(`Are you sure want to ${e.target.checked ? "active" : "inactive"} '${item.title}'?`, item, handelStatusChange)}
                                />
                                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                              </label>
                            </td>
                          )}
                          <td className="py-2 px-4 border-l">
                            <div className="">
                              <ul className="flex justify-center">
                                {(manager?.view || user?.role === "admin") && (
                                  <li onClick={() => handelEdit(item, "view")} className="px-2 py-2  hover:text-gradientTo">
                                    <button title={t("FAQS_EDIT_FAQS")}>
                                      <AiFillEye className="w-5 h-5 text-slate-600" />
                                    </button>
                                  </li>
                                )}
                                {helpers.andOperator(
                                  manager?.add || user?.role === "admin",
                                  <li onClick={() => handelEdit(item, "edit")} className="px-2 py-2  hover:text-gradientTo">
                                    <button title={t("FAQS_EDIT_FAQS")}>
                                      <AiFillEdit className="w-5 h-5 text-slate-600" />
                                    </button>
                                  </li>
                                )}

                                {helpers.andOperator(
                                  manager?.add || user?.role === "admin",
                                  <li onClick={(e) => helpers.alertFunction(`Are you sure want to delete '${item.title}'?`, item, handelDelete, true)} className="px-2 py-2 hover:bg-white hover:text-gradientTo">
                                    <button title={t("DELETE_FAQS")}>
                                      <AiFillDelete className="w-5 h-5 text-red-600" />{" "}
                                    </button>
                                  </li>
                                )}

                                
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}

                  {isEmpty(FAQs) && (
                    <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-2 px-4 border-r dark:border-[#ffffff38]" colSpan={7}>
                        {t("O_NO_RECORD_FOUND")}
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Table;
