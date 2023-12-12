import React, { useState, useEffect } from 'react'
import { makeAuthenticatedGETRequest } from '../utils/serverHelpers';
import { Skeleton } from '@mui/material';

function AddToPlaylistModal({closeModal, addSongToPlaylist}) {

  const [myPlaylists,setMyPlayLists] = useState([]);

  useEffect(()=>{
      const getData = async () =>{
          const response = await makeAuthenticatedGETRequest(
              "/playlist/get/me"
          )
          setMyPlayLists(response.data);
      }
      getData();
  },[])

  return (
    <div className='absolute bg-black w-screen h-screen bg-opacity-50 flex justify-center items-center' onClick={closeModal}>
        <div className='bg-app-black w-1/3 rounded-md p-8' onClick={e=>e.stopPropagation()}>
            <div className='text-white mb-5 font-semibold text-lg'>Select Playlist</div>
            <div className='space-y-4 flex flex-col jutify-center items-center'>
                 {myPlaylists.length>0 ? (myPlaylists.map(item=>{
                  return <PlayListComponent info = {item} addSongToPlaylist = {addSongToPlaylist} closeModal = {closeModal}/>
                 })) : (
                  <div className='space-y-5'>
                    <Skeleton variant='rounded' animation = "wave" width={400} height={50} sx={{ bgcolor: 'grey.800' }}/>
                    <Skeleton variant='rounded' animation = "wave" width={400} height={50} sx={{ bgcolor: 'grey.800' }}/>
                  </div>
                 )}   
            </div>
        </div>
    </div>
  )
}

const PlayListComponent = ({info,addSongToPlaylist,closeModal}) =>{
 // console.log("info",info);
  const checkSong = () =>{
        addSongToPlaylist(info._id)
        closeModal();
  }
  return(
    <div className='bg-app-black w-full flex items-center space-x-4 hover:bg-gray-400 hover:bg-opacity-20 cursor-pointer p-3'
      onClick={checkSong}
    >
      <div>
      <img 
        src={info.thumbnail} 
        className='w-10 h-10 rounded'
        alt='Thumnbail'
      />
      </div>
      <div className='text-white font-semibold'>
          {info.name}
      </div>
        
    </div>
  )
}

export default AddToPlaylistModal