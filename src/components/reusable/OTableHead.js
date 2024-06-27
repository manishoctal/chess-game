import React from 'react'
import { useTranslation } from 'react-i18next';
import helpers from 'utils/helpers';
import { BsCaretDown,BsCaretUp,BsCaretUpFill,BsCaretDownFill    } from "react-icons/bs";
function OTableHead({ sort, name, fieldName, setSort, classTd }) {
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
      <div className={`flex ${helpers.ternaryCondition(fieldName == 'status', 'justify-center', 'justify-start')} ${classTd || ''}`}>
        <span className=''>{t(name)}</span>
        <span className='mx-1'>
          {helpers.ternaryCondition(helpers.andOperator(sort?.sortBy === fieldName,sort?.sortType === "asc"),<BsCaretUpFill size={'8px'}/>,<BsCaretUp size={'8px'} style={{color: sort?.sortBy === fieldName?'':'#1e202480'}}/>)}
          {helpers.ternaryCondition(helpers.andOperator(sort?.sortBy === fieldName, sort?.sortType === "desc"), <BsCaretDownFill size={'8px'}/>,<BsCaretDown size={'8px'} style={{color: sort?.sortBy === fieldName?'':'#1e202480'}}/>)}
        </span>
      </div>
    </th>
  )
}

export default OTableHead