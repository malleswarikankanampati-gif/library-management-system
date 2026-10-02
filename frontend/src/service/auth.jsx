import axios from "axios";
import { BASE_URL } from "./config";
import {
  allLogout,
  getMemberDetailsLocal,
  setCurrentUrl,
} from "../app/features/auth/authSlice";

const REST_URL = BASE_URL + "auth";

export const registerNewMember = (data) =>
  axios.post(REST_URL + "/register", data);

export const tryToLogin = (data) => axios.post(REST_URL + "/login", data);

export const getMemberDetails = () =>
  axios.get(REST_URL + "/get-member-details");

export const getOtherMemberDetails = (id) =>
  axios.get(REST_URL + "/get-member-details/" + id);

export const validatePass = (password) =>
  axios.post(REST_URL + "/validate-password", { password });

export const updateMemberSelf = (data) =>
  axios.put(REST_URL + "/update-self", data);

export const deleteMemberSelf = () => axios.delete(REST_URL + "/delete-self");

export const changePasswordSelf = (data) =>
  axios.put(REST_URL + "/pass-change", data);

export const changeProfilePic = (data) =>
  axios.put(REST_URL + "/pic-update", data);

export const removeProfilePic = () => axios.put(REST_URL + "/delete-pic");

export const getAllMembers = (filters) =>
  axios.post(REST_URL + "/members", filters);

export const updateUserNameSelf = (username) =>
  axios.patch(REST_URL + "/update-username", username);

export const setPasswordSelf = (password) =>
  axios.patch(REST_URL + "/set-password", password);

export const updateOtherStatus = (data) =>
  axios.patch(REST_URL + "/update-status", data);

// ----------------------------------------------------------------------------------

export const storeJwtToken = (token) => {
  localStorage.setItem("jwttoken", token);
};

export const storeJwtTokenExpiration = (exp) => {
  localStorage.setItem("jwttokenexpiration", exp);
};

export const storeAuthenticationStatus = (val) => {
  localStorage.setItem("authstatus", val);
};

export const getJwtToken = () => {
  return localStorage.getItem("jwttoken");
};

export const getJwtTokenExpiration = () => {
  return localStorage.getItem("jwttokenexpiration");
};

export const getAuthenticationStatus = () => {
  return localStorage.getItem("authstatus");
};

export const logout = () => {
  localStorage.clear();
};

// ----------------------------------------------------------------------------------

export const loginUser = async (
  credentials,
  dispatch,
  navigate,
  setErrorMessage,
  currentUrl = "/",
) => {
  try {
    const res = await tryToLogin(credentials);
    dispatch(allLogout());
    storeAuthenticationStatus(true);

    const { type, token, expiration } = res.data;

    storeJwtToken(type + token);
    storeJwtTokenExpiration(expiration);
    dispatch(getMemberDetailsLocal());
    currentUrl && navigate(currentUrl);
    dispatch(setCurrentUrl("/"));
  } catch (err) {
    setErrorMessage(
      err?.response?.data?.message ||
        err.message ||
        "An error occurred while trying to login.",
    );
  }
};

export const loginUserViaOauth = async (
  type = "Bearer ",
  token,
  expiration,
  dispatch,
  navigate,
  setErrorMessage,
  currentUrl = "/",
) => {
  try {
    dispatch(allLogout());
    const fullToken = type + token;
    storeAuthenticationStatus(true);
    storeJwtToken(fullToken);
    storeJwtTokenExpiration(expiration);
    await dispatch(getMemberDetailsLocal());
    currentUrl && navigate(currentUrl);
    dispatch(setCurrentUrl("/"));
  } catch (err) {
    setErrorMessage(
      err?.response?.data?.message ||
        err.message ||
        "An error occurred while trying to login.",
    );
  }
};

axios.interceptors.request.use(
  (config) => {
    const excludedEndpoints = ["/auth/login", "/auth/register"];
    const isExcluded = excludedEndpoints.some((endpoint) =>
      config.url.includes(endpoint),
    );
    if (!isExcluded) {
      config.headers.Authorization = getJwtToken();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
