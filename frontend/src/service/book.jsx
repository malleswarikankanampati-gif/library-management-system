import axios from "axios";
import { BASE_URL } from "./config";

const REST_URL = BASE_URL + "books";

export const getOneBook = (id) => {
  return axios.get(REST_URL + "/" + id);
};

export const addNewBook = (data) => axios.post(REST_URL, data);

export const updateBook = (id, data) => axios.put(REST_URL + "/" + id, data);

export const deleteBook = (id) => axios.delete(REST_URL + "/" + id);

export const increateTotal = (id, data) =>
  axios.patch(REST_URL + "/increase-total/" + id, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const decreaseTotal = (id, data) =>
  axios.patch(REST_URL + "/decrease-total/" + id, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getAllSortingFilters = () => axios.get(REST_URL + "/sort-filters");

export const listAllBooksFiltered = (
  title,
  authorId,
  categoriesIds,
  publisher,
  fromDate,
  tillDate,
  availableCopies,
  page,
  size,
  sort,
  asc
) => {
  let url = REST_URL + "?";

  if (title) url += `title=${encodeURIComponent(title)}&`;
  if (authorId) url += `authorId=${authorId}&`;
  if (categoriesIds && categoriesIds.length > 0)
    url += `categoriesIds=${categoriesIds}&`;
  if (publisher) url += `publisher=${encodeURIComponent(publisher)}&`;
  if (fromDate) url += `fromDate=${fromDate}&`;
  if (tillDate) url += `tillDate=${tillDate}&`;
  if (availableCopies) url += `availableCopies=${availableCopies}&`;
  if (page) url += `page=${page}&`;
  if (size) url += `size=${size}&`;
  if (sort) url += `sort=${encodeURIComponent(sort)}&`;
  if (asc) url += `asc=${encodeURIComponent(asc)}&`;

  url = url.endsWith("&") ? url.slice(0, -1) : url;

  return axios.get(url);
};
