export const getToken = () => {
  return window.localStorage.getItem("access_token");
};

export const setToken = (token) => {
  window.localStorage.setItem("access_token", token);
};
