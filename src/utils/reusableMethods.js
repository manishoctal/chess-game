import dayjs from "dayjs"

export const generateRandomID = (length) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const containsNumbers = (str) => {
  return /\d/.test(str)
}

const isFileTypeSupported = (file, supportedTypes) => !supportedTypes.includes(file.type);

const validateFileSize = (file, maxSize) => file?.size > maxSize;

export const validateFile = (file, type = 'image') => {
  let fileErrorMsg = '';

  const validateAudio = () => {
    if (!file.type.toLowerCase().includes('audio')) {
      fileErrorMsg = 'Only audio files are supported.';
    } else if (validateFileSize(file, 1000 * 1000 * 5)) {
      fileErrorMsg = 'Please, upload file size less than 5mb.';
    }
  };

  const validateVideo = () => {
    if (!file.type.toLowerCase().includes('video')) {
      fileErrorMsg = 'Only video files are supported.';
    } else if (validateFileSize(file, 1000 * 1000 * 30)) {
      fileErrorMsg = 'Please, upload file size less than 30mb.';
    }
  };

  const validateFont = () => {
    if (!file.name.toLowerCase().includes('ttf')) {
      fileErrorMsg = 'Only .ttf files are supported.';
    } else if (validateFileSize(file, 1000 * 1000 * 5)) {
      fileErrorMsg = 'Please, upload file size less than 5mb.';
    }
  };

  const validateStyle = () => {
    if (!file.name.toLowerCase().includes('captionstyle')) {
      fileErrorMsg = 'Only .captionstyle files are supported.';
    } else if (validateFileSize(file, 1000 * 1000 * 5)) {
      fileErrorMsg = 'Please, upload file size less than 5mb.';
    }
  };

  switch (type) {
    case 'audio':
      validateAudio();
      break;
    case 'video':
      validateVideo();
      break;
    case 'Font':
      validateFont();
      break;
    case 'Style':
      validateStyle();
      break;
    default:
      break;
  }

  return fileErrorMsg;
};

export const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png']

export const preventText = (e) => {
  if (!/\d/.test(e.key)) {
    e.preventDefault();
  }
};

export const handleNumericInput = (event) => {
  const isAllowedKey = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(event.key) || /\d/.test(event.key);
  
  if (!isAllowedKey) {
    event.preventDefault();
    return;
  }
  
  // Get the current input value plus the new key
  const inputValue = event.target.value;
  const newValue = inputValue + event.key;

  // Check if the value exceeds 100
  if (parseInt(newValue, 10) > 100) {
    event.preventDefault();
  }
};

let pressedKeys=[];
export const handleKeyDownCashIn = e => {
  pressedKeys.push(e.key);
  const lastKey = pressedKeys[pressedKeys.length - 2]; // Changed var to const

  const isInvalidKey = ['-', '+', 'e'].includes(e.key);
  const isDotKey = e.key === '.';

  if (lastKey === '.') {
    if (isInvalidKey || isDotKey) {
      e.preventDefault();
    }
  } else if (isInvalidKey) {
    e.preventDefault();
  }

  // Prevent entering more than two decimal places
  if (
    !['Backspace', 'Delete', 'Tab'].includes(e.key) &&
    e.target.value?.split('.')[1]?.length >= 2
  ) {
    e.preventDefault();
  }
};


export const preventMaxHundred = e => {
  if (e.target.value > 100) {
    e.target.value = e.target.value.slice(0, 2)
  }
}

export const handleCopy = (e) => {
  e.preventDefault();
};

export const handleCut = (e) => {
  e.preventDefault();
};

export const handlePaste = (e) => {
  e.preventDefault(); 
};


export const getTimeDifference = (expiryTime) => {
  const expiryDate = dayjs(expiryTime);
  const currentDate = dayjs(); 

  const totalMinutesDifference = expiryDate.diff(currentDate, 'minute');

  let hoursDifference = Math.floor(totalMinutesDifference / 60);
  let minutesDifference = totalMinutesDifference % 60;

  let timeDifferenceText = "";

  if (hoursDifference > 0) {
      timeDifferenceText += `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'}`; 
  }

  if (minutesDifference > 0) {
      if (timeDifferenceText) {
          timeDifferenceText += ` and `;
      }
      timeDifferenceText += `${minutesDifference} minute${minutesDifference === 1 ? '' : 's'}`;
  }

  return timeDifferenceText || "0 minutes";
};