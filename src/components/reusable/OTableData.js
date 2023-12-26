import { startCase } from 'lodash'
import React from 'react'
import dayjs from 'dayjs'

export default function OTableData ({ className, data, type = 'text' }) {
  switch (type) {
    case 'text':
      return <td className={className}>{data || 'N/A'}</td>
    case 'startCase':
      return <td className={className}>{startCase(data || 'N/A')}</td>
    case 'number':
      return <td className={className}>{data || 0}</td>
    case 'date':
      return (
        <td className={className}>
          {dayjs(data).format('DD-MM-YYYY hh:mm A')}
        </td>
      )
    case 'image':
      return (
        <td className={className}>
          {<img src={data} alt='thumbnail' width='80' className='m-auto' /> ||
            'N/A'}
        </td>
      )
    default:
      return null
  }
}
