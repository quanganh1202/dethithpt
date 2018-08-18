import jwtDecode from 'jwt-decode';

const TOKEN_KEY = 'access_token';

export async function renew(token) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${ROOT}/renew`, options);
    return response.data.token;
  } catch (err) {
    throw err.response.status;
  }
}

export function setToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export const mappingUser = function mappingUser(token) {
  const user = jwtDecode(token);
  return {
    ...user.data,
    exp: user.exp,
    iat: user.iat,
  };
};

export function getUser() {
  const token = getToken();
  try {
    const user = mappingUser(token);
    if (!Date.now) {
      Date.now = () => new Date().getTime();
    }
    return user.exp * 1000 > Date.now() ? user : false;
  } catch (error) {
    return false;
  }
}

export function isLoggedIn() {
  return !!(getUser());
}