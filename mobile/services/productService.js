import api from "./api";

export const getProducts = (categoryId, keyword) => {
  let url = "/products?";

  if (categoryId) url += `categoryId=${categoryId}&`;
  if (keyword) url += `keyword=${keyword}`;

  return api.get(url);
};