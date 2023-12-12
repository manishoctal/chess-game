import { validationRules } from './constants'

const formValidation = {
  giftName: {
    required: 'Please enter gift name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    },
    maxLength: {
      value: 60,
      message: 'Maximum length should be 60 characters.'
    }
  },

  playlistName: {
    required: 'Please enter playlist name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },

  artistName: {
    required: 'Please enter artist name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },

  soundName: {
    required: 'Please enter sound name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  stickerName: {
    required: 'Please enter sticker name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },

  displayName: {
    required: 'Please enter display name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },

  duration: {
    required: 'Please enter duration.'
  },

  coinNumber: {
    required: 'Please enter coins.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },

    maxLength: {
      value: 6,
      message: 'Maximum length should be 6.'
    }
  },
  packName: {
    required: 'Please enter pack name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    },
    maxLength: {
      value: 150,
      message: 'Maximum length should be 150 characters.'
    }
  },
  noCoins: {
    required: 'Please enter coin.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    maxLength: {
      value: 6,
      message: 'Maximum length should be 6.'
    }
  },

  price: {
    required: 'Please enter price.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    }
  },
  couponCode: {
    required: 'Please enter coupon code.',
    pattern: {
      value: /^[^\s][A-Za-z0-9]+$/ ,
      message: 'Cannot start with a space and use only capital letters.'
    }
  },
  couponAmount: {
    required: 'Please enter coupon amount.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    }
  },
  rewardAmount: {
    required: 'Please enter reward amount.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    }
  },
  numberOfUserCoupon: {
    required: 'Please enter number of user coupon.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    }
  },

  firstName: {
    required: 'Please enter first name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  userFirstName: {
    required: 'Please enter first name.',
    pattern: [
      {
        value: /^[^\s].*/,
        message: 'Cannot start with a space.'
      },
      {
        value: /^[^\s].*/,
        message: 'Cannot start with a space.'
      }
    ],
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  subAdminName: {
    required: 'Please enter first name.',
    validate: {
      noSpace: value => value.trim() !== '' || 'Cannot start with a space.',
      onlyAlphabets: value =>
        /^[a-zA-Z_ ]*$/.test(value) || 'Only alphabets are allowed.',
      minLength: value =>
        value.length >= 2 || 'Minimum length must be 2 characters',
      maxLength: value =>
        value.length <= 20 || 'Maximum length should be 20 characters'
    }
  },
  subAdminLastName: {
    required: 'Please enter last name.',
    validate: {
      noSpace: value => value.trim() !== '' || 'Cannot start with a space.',
      onlyAlphabets: value =>
        /^[a-zA-Z_ ]*$/.test(value) || 'Only alphabets are allowed.',
      minLength: value =>
        value.length >= 2 || 'Minimum length must be 2 characters',
      maxLength: value =>
        value.length <= 20 || 'Maximum length should be 20 characters'
    }
  },

  videoUrl: {
    required: 'Please enter video url.'
  },
  userName: {
    required: 'Please enter user name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },

    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  adminFirstName: {
    required: 'Please enter admin first name.',
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    pattern: {
      value: validationRules.characters,
      message: validationRules.charactersMessage
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  adminLastName: {
    required: 'Please enter admin last name.',
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    pattern: {
      value: validationRules.characters,
      message: validationRules.charactersMessage
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  lastName: {
    required: 'Please enter last name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    maxLength: {
      value: 20,
      message: 'Maximum length should be 20 characters'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  nationalityId: {
    required: 'Please enter nationality Id.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    maxLength: {
      value: 20,
      message: 'Maximum length should be 20 characters'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  email: {
    required: 'Please enter email ID.',
    pattern: {
      value: validationRules.email,
      message: 'Please enter valid email ID as: example@domain.com.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  categoryName: {
    required: 'Please enter category name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    maxLength: {
      value: 60,
      message: 'Maximum length should be 60 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  subject: {
    required: 'Please enter subject.',
    minLength: {
      value: 2,
      message: 'Subject should contain at least 2 characters.'
    },
    maxLength: {
      value: 500,
      message: 'Subject should not exceed 500 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  signature: {
    required: 'Signature is required.',
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    maxLength: {
      value: 500,
      message: 'Signature should not exceed 500 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  amount: {
    required: 'Please enter price.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: val => {
      if (val > 1000000) {
        return 'Subscription price should not be greater then 1000000. '
      } else if (val <= 0) {
        return 'Subscription price should be greater then 0. '
      }
    }
  },
  sendTo: {
    required: 'User type is required.'
  },

  discountPercentage: {
    required: 'Please enter subscription saving.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    validate: val => {
      if (val > 100) {
        return 'Subscription saving percentage should not be greater then 100. '
      }
    }
  },
  planValidity: {
    required: 'Please enter subscription validity.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    }

    // validate: (value) => {
    //   return value?.trim()
    //     ? true
    //     : 'White spaces not allowed.'
    // }
  },
  inclusion: {
    required: 'Please enter subscription inclusion.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  subscriptionName: {
    required: 'Please enter subscription name.',
    pattern: {
      value: /^[a-zA-Z]+$/,
      message: 'Invalid subscription name.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },

  name: {
    required: 'Please enter subscription name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  // categoryName: {
  //   required: 'Please enter category name.',
  //   pattern: {
  //     value: validationRules.characters,
  //     message: validationRules.charactersMessage
  //   },
  //   minLength: {
  //     value: 2,
  //     message: 'Minimum length must be 2.'
  //   },
  //   validate: (value) => {
  //     return value?.trim()
  //       ? true
  //       : 'White spaces not allowed.'
  //   }
  // },
  mobile: {
    required: 'Please enter mobile number.',
    minLength: {
      value: 10,
      message: 'Minimum length should be 10 digits.'
    },
    min: {
      value: 0,
      message: 'Minimum value must is 0.'
    },
    maxLength: {
      value: 10,
      message: 'Maximum length should be 10 digits.'
    }
  },
  alternateEmail: {
    required: 'Please enter alternate email ID.',
    pattern: {
      value: validationRules.email,
      message: 'Please enter valid alternate email ID as: example@domain.com.'
    }
  },
  description: {
    required: 'Please enter description.',
    minLength: {
      value: 10,
      message: 'Description should contains at least 10 characters.'
    },
    maxLength: {
      value: 300,
      message: 'Description should not exceed 300 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  title: {
    required: 'Please enter title.',
    minLength: {
      value: 2,
      message: 'Title should contains at least 2 characters.'
    },
    maxLength: {
      value: 100,
      message: 'Title should not exceed 100 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  news_title: {
    required: 'Please enter news title.',
    minLength: {
      value: 2,
      message: 'Title should contains at least 2 characters.'
    },
    maxLength: {
      value: 100,
      message: 'News title should not exceed 100 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  HRName: {
    required: 'Please enter HR name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  address: {
    required: 'Please enter address.',
    minLength: {
      value: 10,
      message: 'Address should contains at least 10 characters.'
    },
    maxLength: {
      value: 250,
      message: 'Description should not exceed 250 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  accountantName: {
    required: 'Please enter accountant name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  companyName: {
    required: 'Please enter company name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  jobTitle: {
    required: 'Please enter job title.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  jobDescription: {
    required: 'Please enter job description.',
    minLength: {
      value: 10,
      message: 'Job description should contains at least 10 characters.'
    },
    maxLength: {
      value: 200,
      message: 'Job description should not exceed 200 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  terminationCondition: {
    required: 'Please enter termination condition.',
    minLength: {
      value: 10,
      message: 'Termination condition should contains at least 10 characters.'
    },
    maxLength: {
      value: 200,
      message: 'Termination condition should not exceed 200 characters.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  countryName: {
    required: 'Please enter country name.',
    pattern: {
      value: /^[a-zA-Z]+$/,
      message: 'Invalid country name.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  },
  cityName: {
    required: 'Please enter city name.',
    pattern: {
      value: /^[a-zA-Z]+$/,
      message: 'Invalid city name.'
    },
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    },
    validate: {
      whiteSpace: value => (value.trim() ? true : 'White spaces not allowed.')
    }
  }
}

export default formValidation
