import { loginSchema, signupSchema } from '../utils/schema.js';

let currentForm = 'login';
let schema = loginSchema;

export const getCurrentForm = () => currentForm;
export const setCurrentForm = newForm => {
  currentForm = newForm;
};

export const setCurrentSchema = form => {
  schema = form === 'login' ? loginSchema : signupSchema;
};
export const getErrorMsgByInputName = inputName => schema[inputName].error;
export const getIsValidByInputName = inputName => schema[inputName].isValid;
export const getIsValid = () => schema.isValid;
export const setSchemaValueByInputName = (inputName, value) => {
  schema[inputName].value = value;
};
