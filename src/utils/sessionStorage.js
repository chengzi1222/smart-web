import cookie from 'js-cookie';

export function setData(key, data) {
  sessionStorage.setItem(key, data);
}

export function getData(key) {
  return sessionStorage.getItem(key);
}

export function removeData(key) {
  sessionStorage.removeItem(key);
}

export function setCookie(key, data, options) {
  cookie.set(key, data, options);
}

export function removeCookie(key) {
  cookie.remove(key)
}

export function getCookie(key) {
  return cookie.get(key);
}
