import axios from "axios";
import { BASE_URL } from "./config";

const REST_URL = BASE_URL + "categories";

export const listAllCategories = () => axios.get(REST_URL);

export const listAllCatogiriesLikeName = (name) =>
  axios.get(REST_URL + "?name=" + name);

export const addNewCategories = (data) => axios.post(REST_URL, data);

export const getOneCategories = (id) => axios.get(REST_URL + "/" + id);

export const updateOneCategory = (id, data) =>
  axios.put(REST_URL + "/" + id, data);

export const deleteCategory = (id) => axios.delete(REST_URL + "/" + id);

// export const getBooksByCategory = (id) =>
//   axios.get(REST_URL + "/" + id + "/books");
