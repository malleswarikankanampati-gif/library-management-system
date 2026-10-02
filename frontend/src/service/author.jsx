import axios from "axios";
import { BASE_URL } from "./config";

const REST_URL = BASE_URL + "authors";

export const getOneAuthor = (id) => axios.get(REST_URL + "/" + id);

export const addNewAuthor = (data) => axios.post(REST_URL, data);

export const updateOneAuthor = (id, data) =>
  axios.put(REST_URL + "/" + id, data);

export const deleteOneAuthor = (id) => axios.delete(REST_URL + "/" + id);

export const listAllAuthors = (name, page, size, sort, asc) => {
  let url = REST_URL + "?";

  if (name) url += `name=${encodeURIComponent(name)}&`;
  if (page) url += `page=${page}&`;
  if (size) url += `size=${size}&`;
  if (sort) url += `sort=${encodeURIComponent(sort)}&`;
  if (asc) url += `asc=${encodeURIComponent(asc)}&`;

  url = url.endsWith("&") ? url.slice(0, -1) : url;

  return axios.get(url);
};

export const getAllSortingFilters = () => axios.get(REST_URL + "/sort-filters");
