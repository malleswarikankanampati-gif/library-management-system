import axios from "axios";
import { BASE_URL } from "./config";

const REST_URL = BASE_URL + "bookRequest";

export const addNewBookRequest = (data) => axios.post(REST_URL, data);

export const listAllIncompleteBookReq = () => axios.get(REST_URL);

export const listAllBookReq = () => axios.get(REST_URL + "/all");

export const listAllBookRequestsByMember = (id) =>
  axios.get(REST_URL + "/byMember/" + id);

export const deleteBookRequestById = (id) => axios.delete(REST_URL + "/" + id);

export const getOneBookRequestById = (id) => axios.get(REST_URL + "/" + id);

export const updateOneBookRequestById = (id, data) =>
  axios.put(REST_URL + "/" + id, data);

export const markBookReqAsComplete = (id) => axios.patch(REST_URL + "/" + id);
