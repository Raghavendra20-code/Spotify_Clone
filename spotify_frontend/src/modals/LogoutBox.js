import React from 'react'
import { useCookies } from 'react-cookie'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom';

function LogoutBox({closeModal}) {
  const [cookies,setCookies,removeCookies] = useCookies(['firstName','lastName'])
  //console.log(cookies)
  const {firstName,lastName} = cookies;
  const Navigate = useNavigate();
  const logout = () =>{
    removeCookies('token')
    if(!cookies.token){
      console.log("cookies didn't removed", cookies)
      return;
    }
    Navigate('/login')
  }
  return (
    <div className=' absolute h-screen w-screen flex justify-end' onClick={closeModal}>
      <div className=' border border-gray-300 rounded w-52 h-72 mt-16 mr-8 bg-app-black flex flex-col items-center'
       onClick={e => e.stopPropagation()}>
        <div className='bg-white w-16 h-16 mt-10 font-semibold text-xl flex items-center justify-center rounded-full cursor-pointer'>
                  {(firstName[0]+lastName[0]).toUpperCase()}
        </div>
        <div className='mt-5 text-gray-300'>
          {firstName+" "+lastName}
        </div>
        <div className='mt-5 cursor-pointer' onClick={logout}>
          <Icon 
            icon="basil:logout-solid" 
            className='text-gray-300'
            fontSize={40}
          />
        </div>
        <div className='mt-5 text-gray-300'>
          Logout
        </div>
      </div>
    </div>
  )
}

export default LogoutBox