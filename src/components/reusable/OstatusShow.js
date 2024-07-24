import { startCase } from 'lodash'
import React from 'react'

const OstatusShow = ({status}) => {
    switch (status) {
        case 'active': case 'Finished':case 'In Progress':
            return <span className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-green-200 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                
                {startCase(status)}
            </span>

        case 'inactive': case 'Cancelled':
            return <span className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                
                {startCase(status)}
            </span>


        case 'Live':
            return <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-500/10 dark:text-blue-500">
                {startCase(status)}
            </span>


        case 'Not Started':
            return <span class="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
                
                {startCase(status)}
            </span>
    }

}

export default OstatusShow
