function isValidEmail(email) {
  return /^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
    .test(email);
}

function isValidPassword(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    .test(password);
}

function isValidName(name) {
  const MAX_NAME_LENGTH = 30;
  return name !== '' && name.length <= MAX_NAME_LENGTH;
}

function isValidDateOfBirth(date_of_birth) {
  return /^(0[1-9]|[12][0-9]|3[01])[\/\-](0[1-9]|1[012])[\/\-]\d{4}$/
    .test(date_of_birth);
}

export {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidDateOfBirth
};
