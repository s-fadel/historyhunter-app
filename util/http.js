import axios, { Axios } from "axios";

const API_KEY = "AIzaSyDdT-T2nPxKdxUDpST_4Y79mJPpefB7OWM";

const authenticate = async (mode, email, password) => {
  const resp = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
  );
  //console.log("RESP", resp.data);
  return resp.data.idToken;
};

export const signupUser = async (email, password) => {
  return await authenticate("signUp", email, password);
};

export const signinUser = async (email, password) => {
  return await authenticate("signInWithPassword", email, password);
};

export const updateUser = async (displayName, idToken) => {
  const resp = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
    {
      displayName,
      idToken,
      returnSecureToken: true,
    }
  );
 // console.log("RESP-UPDATEUSER", resp.data);
  return resp.data.localId;
};


const rootUrl =
  "https://historyhunt-app-default-rtdb.europe-west1.firebasedatabase.app";

export const storeHunt = (hunt) => {
  axios.post(`${rootUrl}/hunt.json`, hunt);
};
export const storeUser = (userData) => {
  axios.post(`${rootUrl}/users.json`, userData);
};
export const getUser = async () => {
  const resp = await axios.get(`${rootUrl}/users.json`);
 // console.log("resp-GETUSER", resp.data);
  return resp.data;
};

export const getUserById = async (idToken) => {
  const payload = {
    idToken: idToken,
  };
  try {
    const resp = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
      payload
    );
    return resp.data.users;
  } catch (error) {
    console.error(
      "Error fetching user data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getHunt = async (userId) => {
  try {
    const resp = await axios.get(`${rootUrl}/hunt.json`);
    const data = resp.data; 
    const hunts = Object.values(data);

    const matchingHunts = hunts.filter((hunt) => hunt.userId === userId);
    console.log("resp-GETHUNT", matchingHunts);
    return matchingHunts;
  } catch (error) {
    console.error('Error fetching hunt data:', error);
    throw error;
  }
};

