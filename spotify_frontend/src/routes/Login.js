import React, { useState } from 'react'
import { Icon } from '@iconify/react';
import TextInput from '../Components/shared/TextInput';
import PasswordInput from '../Components/shared/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { makeUnauthenticatedPOSTRequest } from '../utils/serverHelpers';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginComponent() {
  const [email,setEmail]  = useState("");
  const [password,setPassword] = useState("")
  const [cookie,setCookie] = useCookies(['token'])
  const navigate = useNavigate();

  const login = async() =>{
    const data = {email,password}
    const response = await makeUnauthenticatedPOSTRequest('/auth/login',data)
    //console.log("response",response)
    if(response && !response.err){
      const {token, firstName, lastName} = response
      const date = new Date()
      date.setDate(date.getDate() + 30)
      setCookie("token",token,{path:"/",expires: date});
      setCookie("firstName",firstName,{path:"/",expires: date});
      setCookie("lastName",lastName,{path:"/",expires: date});
      toast('Logged In!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      navigate('/home')
    } else {
      toast.error('Logged In!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center'>
        <div className='logo p-6 border-b border-solid border-gray-200 w-full flex justify-center'>
            <Icon icon="logos:spotify" width="150"/>
        </div>
        <div className='inputRegion w-1/3 py-10 flex items-center justify-center flex-col'>
          <div className='font-bold mb-4'>To continue, log in to Spotify</div>
          <TextInput 
          label="Email address or Username" 
          placeholder="Email address or Username"
          className='my-2'
          value={email}
          setValue={setEmail}
          />
          <PasswordInput 
          label="Password" 
          placeholder="Password"
          value={password}
          setValue={setPassword}
          />
          <div className='w-full flex item-center justify-end my-8'>
          <button className='bg-green-400 font-semibold p-3 px-10 rounded-full' onClick={(e) =>{
            e.preventDefault();
            login();
          }}>
            LOG IN
          </button>
          </div>
          <div className='w-full border border-solid border-gray-300'></div>
          <div className='my-6 font-semibold text-lg'>
          Don't have an account
          </div>
            <div className='border border-gray-500 text-gray-500 w-full flex items-center justify-center py-4 rounded-full font-bold'>
            <Link to='/signup'>SIGN UP FOR SPOTIFY</Link>
            </div>
          
        </div>
        
    </div>
  )
}

export default LoginComponent