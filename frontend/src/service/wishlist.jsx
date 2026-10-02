import axios from "axios";
import { BASE_URL } from "./config";

const REST_URL = BASE_URL + "wishlist";

export const addBookToWishlist = (data) => axios.post(REST_URL, data);

export const deleteBookFromWishlist = (data) =>
  axios.delete(REST_URL, { data });

export const listWishlistBooksByMember = (memberId) =>
  axios.get(REST_URL + "/books/" + memberId);
