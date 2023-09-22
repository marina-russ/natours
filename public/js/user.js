/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert.js';

export const updateMySettings = async (userData, type) => {
  try {
    const urlPass = "http://127.0.0.1:3000/api/v1/users/updateMyPassword";
    const urlData = "http://127.0.0.1:3000/api/v1/users/updateMe";
    const url =
      type === "password" ? urlPass : urlData;

    const res = await axios({
      method: "PATCH",
      url,
      headers: {
        'Authorization': '',
        'Content-Type': '',
      },
      data: {
        data: userData,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUppercase()} updated successfully!`);
    }
  } catch (err) {
    console.log("Axios Error");
    showAlert("error", err.response.data.message);
  }
};
