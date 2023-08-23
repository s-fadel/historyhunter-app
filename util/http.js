import axios from "axios"

const API_KEY = "AIzaSyDdT-T2nPxKdxUDpST_4Y79mJPpefB7OWM"


const authenticate = async (mode, email, password) => {
  try {
    const resp = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
    console.log("RESP", resp.data);
    return resp.data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error; // Kasta om felet för att hantera det på den övre nivån
  }
};

export const signupUser = async (email, password,) => {
  return await authenticate("signUp", email, password)

}

export const signinUser = async (email, password,) => {
  return await authenticate("signInWithPassword", email, password)
}
