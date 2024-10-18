export const validations = {
  text: {
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    }
  },
  name: {
    minLength: {
      value: 2,
      message: 'Minimum length must be 2.'
    }
  }
}

export const preventMaxInput = (e, limit) => {
  e.target.value = e.target.value.trimStart();
    e.target.value = e.target.value.replace(/ {2,}/g, ' ');
  if (e.target.value.length > limit) {
    e.target.value = e.target.value.slice(0, limit);
  }
};