import AuthContext from 'context/AuthContext';
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { AiFillEye } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import helpers from 'utils/helpers'
const OViewData = ({manager,item,link}) => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    return (
        <td className="py-2 border-l px-4">
            <div className="">
                <ul className="justify-center flex">
                    {helpers.andOperator((helpers?.orOperator(manager?.view, user?.role === "admin")), (<li className="px-2 hover:text-gradientTo py-2 ">
                        <NavLink to={link} title={t("O_VIEW")} state={item}>
                            <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                        </NavLink>
                    </li>))}
                </ul>
            </div>
        </td>
    )
}

export default OViewData