import {axios, baseURL} from './index'

export const enterRoom = ({ email, roomNumber, smallBlind, chips }, callback) => {
  const data = { email, roomNumber, smallBlind, chips };

  axios
    .post(`${baseURL}/rooms/enter`, data)
    .then((res) => callback(res))
    .catch((err) => callback(err));
}