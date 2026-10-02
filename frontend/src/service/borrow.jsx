import axios from "axios";
import { BASE_URL } from "./config";

const REST_URL = BASE_URL + "borrow";

export const addBookToBorrow = (data) => axios.post(REST_URL, data);

export const deleteBookFromBorrow = (data) => axios.delete(REST_URL, { data });

export const listBorrowBooksByMember = (memberId, limit) =>
  axios.post(REST_URL + "/books/" + memberId, { limit: limit ? limit : 0 });

export const listMemberByBorrow = (bookId) =>
  axios.get(REST_URL + "/members/" + bookId);

export const getAllPendingBorrow = () => axios.get(REST_URL + "/pending");
