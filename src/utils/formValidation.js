import { useTranslation } from 'react-i18next'
import { validationRules } from './constants'


const FormValidation =()=>{
  const {t}=  useTranslation()
return {
  couponCode: {
    required: 'Please enter coupon code.',
    pattern: {
      value: /^[^\s][A-Za-z0-9]+$/ ,
      message: 'Cannot start with a space and use only capital letters.'
    },
    minLength: {
      value: 15,
      message: t('MINIMUM_LENGTH_MUST_BE_15')
    },
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
  firstName: {
    required: 'Please enter first name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: t('MINIMUM_LENGTH_MUST_BE_2')
    },
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

  lastName: {
    required: 'Please enter last name.',
    pattern: {
      value: /^[^\s].*/,
      message: 'Cannot start with a space.'
    },
    minLength: {
      value: 2,
      message: t('MINIMUM_LENGTH_MUST_BE_2')
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
      message: t('MINIMUM_LENGTH_MUST_BE_2')
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
    required: t('PLEASE_ENTER_TITLE'),
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
}
}

export default FormValidation
