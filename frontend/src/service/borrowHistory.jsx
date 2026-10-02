import axios from "axios";
import { BASE_URL } from "./config";

const REST_URL = BASE_URL + "borrow-history";

export const getBorrowHistoryByBookId = (bookId, page) =>
  axios.post(REST_URL + "/book/" + bookId, page);

export const getBorrowHistoryByMemberId = (memberId, page) =>
  axios.post(REST_URL + "/member/" + memberId, page);

export const getBorrowHistoryForSelf = (page) => axios.post(REST_URL, page);

export const getAllSortingFilters = () => axios.get(REST_URL + "/sort-filters");
