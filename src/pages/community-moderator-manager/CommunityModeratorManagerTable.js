import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import helpers from "utils/helpers";
import ONotificationTableHead from "../../components/reusable/OTableHead";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

const CommunityModeratorManagerTable = ({ allCommunity, paginationObj, sort, setSort, pageSize, manager,handelStatusChange }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);


  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <ONotificationTableHead sort={sort} setSort={setSort} name="Post ID" fieldName="postId" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Username" fieldName="userName" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Post Title" fieldName="postTitle" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Like Count" fieldName="likeCount" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Comment Count" fieldName="commentCount" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Report Count" fieldName="reportCount" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Community" fieldName="community" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Status" fieldName="status" classTd={"justify-center"} />
              <ONotificationTableHead sort={sort} setSort={setSort} name="Created At" fieldName="createdAt" classTd={"justify-center"} />
              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            {allCommunity && allCommunity?.length > 0 && 
              allCommunity?.map((item, i) => (
                <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="py-4 px-6 border-r font-medium text-gray-900  dark:text-white">
                    {i + 1 + pageSize * (paginationObj?.page - 1)}
                  </th>

                  <td className="py-4 px-6 border-r text-center">{item?.postId || "N/A"}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.user,item?.user?.userName,"N/A" )}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.postTitle,item?.postTitle,"N/A" )} </td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.likeCount,item?.likeCount,"0" )} </td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.commentCount,item?.commentCount,"0" )}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.reportCount,item?.reportCount,"0" )}</td>
                  <td className="py-4 px-6 border-r text-center">{helpers?.ternaryCondition(item?.community,item?.community,"N/A" )}</td>
                  
                  {(manager?.add || manager?.edit || user?.role === "admin") && (
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                    <label className="inline-flex relative items-center cursor-pointer" title={`${helpers.ternaryCondition(item?.status === "active", "Active", "Inactive")}`}>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status === "active"}
                        onChange={(e) => helpers.alertFunction(`${t("ARE_YOU_SURE_YOU_WANT_TO")} ${helpers.ternaryCondition(e.target.checked, "active", "inactive")} '${item.postTitle}'?`, item, handelStatusChange)}
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                    </label>
                  </td>
                )}
                
                  <td className="py-4 px-6 border-r text-center">{helpers.getDateAndTime(item?.createdAt)}</td>
                  <td className="py-2 px-3 border-l">
                  <div className="">
                    <ul className="flex justify-center">
                        <li
                          onClick={() =>
                            navigate(`/community-moderator-manager/view/${item?._id}`, {
                              state: { item, type: "view" },
                            })
                          }
                          className="px-2 py-2 hover:bg-white dark:hover:bg-transparent hover:text-LightBlue "
                        >
                          <a>
                            {" "}
                            <AiFillEye className="text-slate-600 w-5 h-5 cursor-pointer  " />
                          </a>
                        </li>
                     
                    </ul>
                  </div>
                </td>
                </tr>
              ))}

            {isEmpty(allCommunity) && (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 border-r" colSpan={12}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityModeratorManagerTable;
