export const KYCStatusArray = [
  {
    key: "approved",
    value: "approved",
  },
  {
    key: "pending",
    value: "pending",
  },
  {
    key: "rejected",
    value: "rejected",
  },
  {
    key: "KYCNotUploadedYet",
    value: "KYCNotUploadedYet",
  },
];

export const validationRules = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

  // Updated password pattern using \d for digits
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,}$/,
  
  passwordMessage:
    "Old password must contain lowercase, uppercase characters, numbers, a special character, and be between 8 to 16 characters long.",
    
  confirmPasswordMessage:
    "Confirm Old password must contain lowercase, uppercase characters, numbers, a special character, and be between 8 to 16 characters long.",
    
  newPasswordMessage:
    "New password must contain lowercase, uppercase characters, numbers, a special character, and be between 8 to 16 characters long.",

  // Updated numbers pattern using \d
  characters: /^[a-zA-Z_ ]*$/,
  charactersMessage: "Only alphabets are allowed.",
  
  numbers: /^\d*$/,  // Updated to \d for digits
};

export const formLengthValidation = {
  name: 16,
  InterestName: 150,
  InterestRejex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/,
  InterestValidation:
    "please enter name in uppercase, lowercase, and all special characters.",
};
