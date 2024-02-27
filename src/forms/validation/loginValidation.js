const loginValidation = values => {
  const errors = {};

  if (!values.userName) {
    errors.userName = 'Required';
  } else if (values.userName.length > 15) {
    errors.userName = 'Must be 15 characters or less';
  } else if (!/^[A-Za-z][A-Za-z0-9_]{7,29}$/i.test(values.userName)) {
    errors.userName = 'Invalid Usename';
  }

  return errors;
};

export default loginValidation;