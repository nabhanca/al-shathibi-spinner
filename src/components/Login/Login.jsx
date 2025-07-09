import React, { useContext, useState } from 'react'
import './login.css'
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../../Firebase Folder/FirebaseConfig';
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContextProvider } from '../../Context/AuthContext';
import Cookies from 'js-cookie';
const Login = () => {

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const {user,setUser}=useContext(AuthContextProvider)
  const handleSubmit=(e)=>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // navigate("/home")
        setUser(user)
        Cookies.set('user', JSON.stringify(user), { expires: 1 }); // 1 day
        console.log(user);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
    });
  }
  return (
    <div className='login'>
     <form >

     <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
     <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
     
     <button onClick={handleSubmit}>submit</button>
     </form>
    </div>
  )
}

export default Login