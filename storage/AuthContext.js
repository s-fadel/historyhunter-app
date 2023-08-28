import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

export const AuthContext = createContext({
   token: "",
   isAuthenticated: false,
   authenticate: (token, localId) => {},
   email: "",
   logout: () => { }
})

const AuthContextProvider = ({ children }) => {
   const [token, setToken] = useState(null)
   const [email, setEmail] = useState(null)
   const isAuthenticated = !!token; // convertera truthy och falsy till en riktig boolean

   const authenticate = (token, email) => {
      setToken(token);
      setEmail(email);
      AsyncStorage.setItem('appToken', token)
   };

   const logout = () => {
      setToken(null);
      setEmail(null);
      AsyncStorage.removeItem('appToken')
   }

   const value = {
      token,
      email,
      isAuthenticated,
      authenticate,
      logout
   }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider;