import dayjs from 'dayjs'
import { compact } from 'lodash'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const calendar = require('dayjs/plugin/calendar')
const MySwal = withReactContent(Swal)

dayjs.extend(calendar)

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
const helpers = {
  currencyFormat: (number = '') => {
    return new Intl.NumberFormat('en-IN', {}).format(number)
  },
  dateFormat: (date, timeZone) => {
    const convertedDate = new Date(date).toLocaleString(undefined, {
      timeZone: timeZone || 'Asia/Kolkata'
    })

    return convertedDate.toString()
  },

  msgDateFormat: (date, timeZone) => {
    const convertedDate = new Date(date).toLocaleDateString(undefined, {
      timeZone: timeZone || 'Asia/Kolkata'
    })

    return convertedDate.toString()
  },
  matchDateTime: (date, timeZone) => {
    return dayjs(date).calendar(null, {
      sameDay: 'h:mm A', // The same day ( Today at 2:30 AM )
      nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
      nextWeek: 'dddd [at] h:mm A', // The next week ( Sunday at 2:30 AM )
      lastDay: '[Yesterday at] h:mm A', // The day before ( Yesterday at 2:30 AM )
      lastWeek: '[Last] dddd [at] h:mm A', // Last week ( Last Monday at 2:30 AM )
      sameElse: 'DD/MM/YYYY' // Everything else ( 17/10/2011 )
    })
  },
  marketStatus: s => {
    let status
    switch (s) {
      case 1:
        status = 'Open'
        break
      case 2:
        status = 'In Active'
        break
      case 3:
        status = 'Suspended'
        break
      case 4:
        status = 'Closed'
        break
      case 9:
        status = 'Ball Start'
        break
      default:
        status = ''
    }
    return status
  },
  getSportType: t => {
    let type
    switch (t) {
      case 1:
        type = 'soccer'
        break
      case 2:
        type = 'tennis'
        break
      case 4:
        type = 'cricket'
        break

      default:
        type = ''
    }
    return type
  },
  isInputNumber: event => {
    const char = String.fromCharCode(event.which)
    if (!/[0-9]/.test(char)) {
      event.preventDefault()
    }
  },

  alertFunction: (title, item, changeFunction, deleteIcon) => {
    MySwal.fire({
      // title: <h3>{title}</h3>,
      html: (
        <>
          <strong className='dark:text-white'>{title}</strong>
        </>
      ),
      icon: deleteIcon ? 'error' : 'warning',
      showConfirmButton: 'Okay',
      showCancelButton: true,
      customClass:
        'dark:bg-gray-800 border border-white dark:border-[#ffffff38]',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        changeFunction(item)
      }
    })
  },
  // downloadFile: (url) => {
  //   if (isEmpty(url)) {
  //     window?.alert("Invalid URL");
  //     return false;
  //   }
  //   const parts = url.split("/");
  //   const filename = parts[parts.length - 1];
  //   const xhr = new XMLHttpRequest();
  //   xhr.open("GET", url, true);
  //   xhr.responseType = "blob";
  //   xhr.onload = () => {
  //     const a = document.createElement("a");
  //     const url = window.URL.createObjectURL(xhr.response);
  //     a.href = url;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   };
  //   xhr.send();
  // },

  downloadFile: link => {
    if (!link) {
      window?.alert('Invalid URL')
      return
    }

    const parts = link.split('/')
    const filename = parts[parts.length - 1]

    const xhr = new XMLHttpRequest()
    xhr.open('GET', link, true)
    xhr.responseType = 'blob'

    xhr.onload = () => {
      if (xhr.status === 200) {
        const a = document.createElement('a')
        const url = window.URL.createObjectURL(xhr.response)

        a.href = url
        a.download = filename

        // Append the anchor element to the body
        document.body.appendChild(a)

        // Programmatically click the anchor element
        a.click()

        // Remove the anchor element from the body
        document.body.removeChild(a)

        // Revoke the object URL to free up resources
        window.URL.revokeObjectURL(url)
      } else {
        window?.alert(`Failed to download file. Status: ${xhr.status}`)
      }
    }

    xhr.onerror = () => {
      window?.alert('Failed to download file. Check the URL and try again.')
    }

    xhr.send()
  },

  generatePassword: async length => {
    const passwordLength = length
    const numberChars = '0123456789'
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz'
    const specialChars = '#?@$%&'
    const allChars = numberChars + upperChars + lowerChars + specialChars
    let randPasswordArray = Array(passwordLength)
    randPasswordArray[0] = numberChars
    randPasswordArray[1] = upperChars
    randPasswordArray[2] = lowerChars
    randPasswordArray[3] = specialChars
    randPasswordArray = randPasswordArray.fill(allChars, 4)
    return shuffleArray(
      randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)]
      })
    ).join('')
  },

  requiredField: async () => {
    return <span className='text-red-500'>*</span>
  },

  getSeconds: (dateStr1, dateStr2) => {
    const date1 = dayjs(dateStr1)
    const date2 = dayjs(dateStr2)

    // Get the difference in seconds
    return compact([date2.diff(date1, 'second')])[0]
  },
  getDateAndTime: date => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  },
  preventForNumberInput: e => {
    if (['-', '+', 'e'].includes(e.key)) {
      e.preventDefault()
    }
    if (['.'].includes(e?.target?.value)) {
      const afterDecimal = e?.target?.value?.split('.')
      if (afterDecimal[1]?.length > 2) {
        e.preventDefault()
      }
    }
  },
  ternaryCondition: (condition, first, second) => {
    return condition ? first : second
  },
  andOperator: (condition, text) => {
    return condition && text
  },
  getFullName: (firstName, lastName) => {
    return compact([firstName, lastName]).join(' ')
  },
  formattedAmount: amount => {
    return amount?.toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
      currencyDisplay: 'symbol'
    })

  },
  capitalizeFirstLetter: (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  }
}

export default helpers
