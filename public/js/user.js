/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

export const updateMySettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      headers: {
        'Authorization': '',
        'Content-Type': '',
      },
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUppercase()} updated successfully!`);
    }
  } catch (err) {
    console.log("Axios Error");
    showAlert("error", err.response.data.message);
  }
};
