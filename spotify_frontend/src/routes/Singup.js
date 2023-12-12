import React, { useState } from 'react'
import { Icon } from '@iconify/react';
import TextInput from '../Components/shared/TextInput';
import PasswordInput from '../Components/shared/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { makeUnauthenticatedPOSTRequest } from '../utils/serverHelpers';
import {useCookies} from 'react-cookie'

function SignupComponent() {
  const [email,setEmail] = useState("");
  const [confirmEmail,setConfirmEmail] = useState("");
  const [username,setUserName] = useState("");
  const [password,setPassword] = useState("");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [cookie,setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const signUp = async() =>{
    if(email !== confirmEmail){
      alert("Email and confirm email must match. Please check again")
      return;
    }
    const data = {email,password, username, firstName, lastName}
    const response = await makeUnauthenticatedPOSTRequest('/auth/register',data)
    if(response && !response.err){
      const {token,firstName, lastName} = response
      const date = new Date()
      date.setDate(date.getDate() + 30)
      setCookie("token",token,{path:"/",expires: date});
      setCookie("firstName",firstName,{path:"/",expires: date});
      setCookie("lastName",lastName,{path:"/",expires: date});
      alert("Success")
      navigate('/home')
    } else {
      alert("Failure")
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center'>
        <div className='logo p-5 border-b border-solid border-gray-300 w-full flex justify-center'>
            <Icon icon="logos:spotify" width="150"/>
        </div>
        <div className='inputRegion w-1/3 py-10 flex items-center justify-center flex-col'>
          <div className='font-bold mb-4 text-2xl'>
            Sign up for free to start listening
            </div>
          <TextInput 
          label="Email address" 
          placeholder="Enter your email"
          value={email}
          setValue={setEmail}
          className='my-2'
          />
          <TextInput 
          label="Confirm Email Address" 
          placeholder="Enter your email again"
          className='my-2'
          value={confirmEmail}
          setValue={setConfirmEmail}
          />
          <TextInput 
          label="User Name" 
          placeholder="Enter your User Name"
          className='my-2'
          value={username}
          setValue={setUserName}
          />
          <PasswordInput 
          label="Create Password" 
          placeholder="Enter a strong password"
          value={password}
          setValue={setPassword}
          />
          <div className='w-full flex justify-between items-center space-x-8'>
            <TextInput 
            label="First Name" 
            placeholder="Enter your First Name"
            className='my-6'
            value={firstName}
            setValue={setFirstName}
            />
            <TextInput 
            label="Last Name" 
            placeholder="Enter your Last Name"
            className='my-6'
            value={lastName}
            setValue={setLastName}
            />
          </div>
          <div className='w-full flex item-center justify-center my-8'>
          <button className='bg-green-400 font-semibold p-3 px-10 rounded-full' 
          onClick={e =>{
            e.preventDefault()
            signUp()
            }}>
            Sign Up
            </button>
          </div>
          <div className='w-full border border-solid border-gray-300'></div>
          <div className='my-6 font-semibold text-lg'>
          Already have an account?
          </div>
          
          <div className='border border-gray-500 text-gray-500 w-full flex items-center justify-center py-4 rounded-full font-bold'>
          <Link to ='/login'>LOG IN INSTEAD</Link>
          </div>
          
        </div>
        
    </div>
  )
}

export default SignupComponent