export const KYCStatusArray = [
  {
    key: 'approved',
    value: 'approved'
  },
  {
    key: 'pending',
    value: 'pending'
  },
  {
    key: 'rejected',
    value: 'rejected'
  },
  {
    key: 'KYCNotUploadedYet',
    value: 'KYCNotUploadedYet'
  },
]



export const validationRules = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  passwordMessage:
    "Password must contain uppercase and lowercase characters, numbers, special character and must be minimum 8 character long.",
  confirmPasswordMessage:
    "Confirm password must contain uppercase and lowercase characters, numbers, special character and must be minimum 8 character long.",
  newPasswordMessage:
    "New password must contain uppercase and lowercase characters, numbers, special character and must be minimum 8 character long.",
  characters: /^[a-zA-Z_ ]*$/,
  charactersMessage: "Only alphabets are allowed.",
  numbers: /^[0-9]*$/,
};

export const formLengthValidation = {
  name: 16,
  InterestName: 150,
  InterestRejex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/,
  InterestValidation:
    "please enter name in uppercase, lowercase, and all special characters.",
};


