import React from 'react'
import { useTranslation } from 'react-i18next';
import { BsArrowUpShort } from 'react-icons/bs';
import helpers from 'utils/helpers';

function OTableHead({sort, name, fieldName, setSort}) {
  const { t } = useTranslation();
  return (
        <th
                scope="col"
                className="py-3 px-3 cursor-pointer"
                onClick={() => {
                  if (sort?.sortBy === fieldName && sort?.sortType === "asc") {
                    setSort({
                      sortBy: fieldName,
                      sortType: "desc",
                    });
                  } else {
                    setSort({
                      sortBy: fieldName,
                      sortType: "asc",
                    });
                  }
                }}
              >
                <div className={`flex ${helpers.ternaryCondition(fieldName=='status','justify-center','justify-start')} `}>
                  <span>{t(name)}</span>
                  <span>
                    {sort?.sortBy === fieldName && sort?.sortType === "asc" && (
                      <BsArrowUpShort className="w-4 h-4" />
                    )}
                    {sort?.sortBy === fieldName &&
                      sort?.sortType === "desc" && (
                        <BsArrowUpShort className="w-4 h-4 rotate-180" />
                      )}
                  </span>
                </div>
              </th>
  )
}

export default OTableHead