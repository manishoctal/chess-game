import dayjs from "dayjs";
import { compact } from "lodash";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const calendar = require("dayjs/plugin/calendar");
const MySwal = withReactContent(Swal);

dayjs.extend(calendar);

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
const helpers = {
  currencyFormat: (number = "") => {
    return new Intl.NumberFormat("en-IN", {}).format(number);
  },
  dateFormat: (date, timeZone) => {
    const convertedDate = new Date(date).toLocaleString(undefined, {
      timeZone: timeZone || "Asia/Kolkata",
    });

    return convertedDate.toString();
  },



  matchDateFormat: (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = String(date.getUTCFullYear()).slice(-4);

      let hours = date.getUTCHours();
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');

      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strHours = String(hours).padStart(2, '0');

      return `${day}-${month}-${year} ${strHours}:${minutes} ${ampm}`;
    }
  },


  msgDateFormat: (date, timeZone) => {
    const convertedDate = new Date(date).toLocaleDateString(undefined, {
      timeZone: timeZone || "Asia/Kolkata",
    });

    return convertedDate.toString();
  },
  matchDateTime: (date, timeZone) => {
    return dayjs(date).calendar(null, {
      sameDay: "h:mm A", // The same day ( Today at 2:30 AM )
      nextDay: "[Tomorrow]", // The next day ( Tomorrow at 2:30 AM )
      nextWeek: "dddd [at] h:mm A", // The next week ( Sunday at 2:30 AM )
      lastDay: "[Yesterday at] h:mm A", // The day before ( Yesterday at 2:30 AM )
      lastWeek: "[Last] dddd [at] h:mm A", // Last week ( Last Monday at 2:30 AM )
      sameElse: "DD/MM/YYYY", // Everything else ( 17/10/2011 )
    });
  },

  getFormattedDate: (date, format) => {
    return date ? dayjs(date).format(format || 'YYYY-MM-DD') : null
  },

  marketStatus: (s) => {
    let status;
    switch (s) {
      case 1:
        status = "Open";
        break;
      case 2:
        status = "In Active";
        break;
      case 3:
        status = "Suspended";
        break;
      case 4:
        status = "Closed";
        break;
      case 9:
        status = "Ball Start";
        break;
      default:
        status = "";
    }
    return status;
  },
  getSportType: (t) => {
    let type;
    switch (t) {
      case 1:
        type = "soccer";
        break;
      case 2:
        type = "tennis";
        break;
      case 4:
        type = "cricket";
        break;

      default:
        type = "";
    }
    return type;
  },
  isInputNumber: (event) => {
    const char = String.fromCharCode(event.which);
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  },

  alertFunction: (title, item, changeFunction, deleteIcon) => {
    MySwal.fire({
      // title: <h3>{title}</h3>,
      html: (
        <>
          <strong className="dark:text-white">{title}</strong>
        </>
      ),
      icon: deleteIcon ? "error" : "warning",
      showConfirmButton: "Okay",
      showCancelButton: true,
      customClass:
        "dark:bg-gray-800 border border-white dark:border-[#ffffff38]",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        changeFunction(item);
      },
    });
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

  downloadFile: (link) => {
    if (!link) {
      window?.alert("Invalid URL");
      return;
    }

    const parts = link.split("/");
    const filename = parts[parts.length - 1];

    const xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.responseType = "blob";

    xhr.onload = () => {
      if (xhr.status === 200) {
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(xhr.response);

        a.href = url;
        a.download = filename;

        // Append the anchor element to the body
        document.body.appendChild(a);

        // Programmatically click the anchor element
        a.click();

        // Remove the anchor element from the body
        document.body.removeChild(a);

        // Revoke the object URL to free up resources
        window.URL.revokeObjectURL(url);
      } else {
        window?.alert(`Failed to download file. Status: ${xhr.status}`);
      }
    };

    xhr.onerror = () => {
      window?.alert("Failed to download file. Check the URL and try again.");
    };

    xhr.send();
  },

  generatePassword: async (length) => {
    const passwordLength = length;
    const numberChars = "0123456789";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const specialChars = "#?@$%&";
    const allChars = numberChars + upperChars + lowerChars + specialChars;
    let randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = specialChars;
    randPasswordArray = randPasswordArray.fill(allChars, 4);
    return shuffleArray(
      randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
    ).join("");
  },

  requiredField: async () => {
    return <span className="text-red-500">*</span>;
  },

  getSeconds: (dateStr1, dateStr2) => {
    const date1 = dayjs(dateStr1);
    const date2 = dayjs(dateStr2);

    // Get the difference in seconds
    return compact([date2.diff(date1, "second")])[0];
  },
  getDateAndTime: (date) => {
    return dayjs(date).format("DD-MM-YYYY hh:mm A");
  },
  preventForNumberInput: (e) => {
    if (["-", "+", "e"].includes(e.key)) {
      e.preventDefault();
    }
    if (["."].includes(e?.target?.value)) {
      const afterDecimal = e?.target?.value?.split(".");
      if (afterDecimal[1]?.length > 2) {
        e.preventDefault();
      }
    }
  },
  ternaryCondition: (condition, first, second) => {
    return condition ? first : second;
  },
  andOperator: (condition, text) => {
    return condition && text;
  },
  orOperator: (condition, text) => {
    return condition || text;
  },
  getFullName: (firstName, lastName) => {
    return compact([firstName, lastName]).join(" ");
  },
  // formattedAmount: (amount) => {
  //   return amount?.toLocaleString("th-TH", {
  //     style: "currency",
  //     currency: "USD",
  //     currencyDisplay: "symbol",
  //   });
  // },

  formattedAmount :(value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(value);
  },

   getCurrencyByCountry : (countryCode) => {
    console.log("countryCode",countryCode)
  },
  

  formattedAmountAllCountry: (amount, countryName) => {
    console.log("countryName", countryName);
    let currencyCode;

    // Define a mapping of countries to their respective currency codes
    const currencyMap = {
        "India": "INR",
        "USA": "USD",
        "Canada": "CAD",
        "UK": "GBP",
        "Australia": "AUD"
    };

    // Define exchange rates to USD
    const exchangeRatesToUSD = {
        "INR": 84.94,   // 1 INR = 84.0752 INR to USD
        "USD": 1,         // 1 USD = 1 USD
        "CAD": 1.3576,    // 1 CAD = 1.3576 USD
        "AUD": 1.4702,    // 1 AUD = 1.4702 USD
        "GBP": 0.7621     // 1 GBP = 0.7621 USD
    };

    // Get the currency code based on the country name
    currencyCode = currencyMap[countryName];

    // Log the currency code to ensure it's correctly fetched
    console.log("currencyCode", currencyCode);

    // Handle case where the countryName doesn't exist in the map
    if (!currencyCode) {
        currencyCode = "INR"; // Default to INR
    }

    // Convert the amount to USD if it's not in USD already
    let amountInUSD = amount;
    if (currencyCode !== "USD") {
        const conversionRate = exchangeRatesToUSD[currencyCode];
        if (conversionRate) {
            amountInUSD = amount / conversionRate; // Convert to USD based on exchange rate
            console.log(`Converted ${amount} ${currencyCode} to ${amountInUSD} USD`);
        }
    }

    // Format the amount in USD using Intl.NumberFormat
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: "USD",  // Format as USD
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatter.format(amountInUSD); // Return the formatted USD value
},

  
  //   return amount?.toLocaleString("th-TH", {
  //     style: "currency",
  //     currency: currencyCode,
  //     currencyDisplay: "symbol",
  //   });
  // },

  formateNull: (text) => {
    let result = "";
    if (text) {
      result = text;
    }
    return result;
  },


  getMatchStatus: (status) => {
    switch (status) {
      case 'Live':
        return 'text-blue-600 font-bold';
      case 'Not Started':
        return 'text-yellow-400 font-bold';
      case 'Finished':case 'In Progress':
        return 'text-green-600 font-bold';
      case 'Cancelled':
        return 'text-red-600 font-bold';
        case 'Delayed':
          return 'text-[#ec9630] font-bold';
    }
  },

  turboConsole: (message, data) => {
    return console.log(
      `%c ${message || ''}, ${data || ''}`, "color: white; font-size: 16px; background: red");
  },
  normalizeSpaces: (str) => {
    return str?.replace(/\s+/g, ' ')?.trim();
  }

};

export default helpers;
