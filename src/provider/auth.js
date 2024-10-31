import { axios, baseURL } from "./index";

export const signup = (
  { firstname, lastname, birth, phonenumber, email, zipcode, pwd },
  callback
) => {
  const data = {
    firstname,
    lastname,
    birth,
    phonenumber,
    email,
    zipcode,
    password: pwd,
  };

  axios
    .post(`${baseURL}/users/signup`, data)
    .then((res) => callback(res))
    .catch((err) => callback(err));
};

export const signin = ({ email, password }, callback) => {
  const data = { email, password: password };
  axios
    .post(`${baseURL}/users/signin`, data)
    .then((res) => callback(res))
    .catch((err) => callback(err));
};
