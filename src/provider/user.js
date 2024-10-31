import {axios, baseURL} from './index'

export const getUser = ({ email, callback }) => {
  axios
    .get(`${baseURL}/users/${email}`)
    .then(res => {
      callback(res)
    })
    .catch(err => callback(err))
}