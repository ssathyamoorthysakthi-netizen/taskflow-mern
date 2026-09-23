const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const validators = {
  isEmail(value) {
    return typeof value === 'string' && EMAIL_REGEX.test(value);
  },
  isPassword(value) {
    return typeof value === 'string' && value.length >= 6;
  },
  isName(value) {
    return typeof value === 'string' && value.trim().length >= 2;
  },
  isTitle(value) {
    return typeof value === 'string' && value.trim().length >= 1;
  },
  isPriority(value) {
    return ['low', 'medium', 'high'].includes(value);
  },
  isStatus(value) {
    return ['todo', 'in-progress', 'completed'].includes(value);
  },
  isCategory(value) {
    return ['Development', 'Design', 'Testing', 'Documentation', 'Meeting', 'Other'].includes(value);
  },
  isRole(value) {
    return ['user', 'admin'].includes(value);
  },
  isDate(value) {
    return value === null || value === undefined || value === '' ? true : !isNaN(Date.parse(value));
  },
};

module.exports = validators;