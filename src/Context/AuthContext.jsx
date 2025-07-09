import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";

export const AuthContextProvider= createContext()

const AuthContext = ({children}) => {
  const [user,setUser]=useState()
 const navigate=useNavigate()
 var userCokie= Cookies.get("user");

  useEffect (()=>{
    if(user || userCokie){
      navigate('/')
    }else{
      navigate('/signup')
    }
  },[user,userCokie])

  return (
    <AuthContextProvider.Provider value={{user,setUser}} >
    {children}
    </AuthContextProvider.Provider>
  )
}

export default AuthContext