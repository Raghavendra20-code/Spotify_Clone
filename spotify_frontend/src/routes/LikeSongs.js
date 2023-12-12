import React, { useEffect, useState } from 'react'
import LoggedInContainer from '../Containers/LoggedInContainer'
import SingleLikedSong from '../Components/shared/SingleLikedSong'
import { makeAuthenticatedGETRequest } from '../utils/serverHelpers'
import { Skeleton } from '@mui/material';

function LikeSongs() {
  const [likedSongData,setLikedSongData] = useState({});

  useEffect(()=>{
    const getData = async() =>{
      const response = await  makeAuthenticatedGETRequest('/song/get/likedSongs')
      setLikedSongData(response.data);
    }
    getData();
  },[])
  return (
    <LoggedInContainer curActiveScreen={'likedSongs'}>
            <div className='text-white text-xl pt-8 pl-4 font-semibold'>
                Liked Songs
            </div>
            <div className='py-5 grid gap-5 grid-cols-2'>
                {
                  likedSongData._id  ?(
                    likedSongData.likedSongs.map(item=>{
                      return <SingleLikedSong
                              info = {item}
                              key = {JSON.stringify(item)}  
                            />
                    })
                  ):(
                    <>
                      <Skeleton variant='rounded' animation = "wave" width={400} height={200} sx={{ bgcolor: 'grey.800' }}/>
                      <Skeleton variant='rounded' animation = "wave" width={400} height={200} sx={{ bgcolor: 'grey.800' }}/>
                      <Skeleton variant='rounded' animation = "wave" width={400} height={200} sx={{ bgcolor: 'grey.800' }}/>
                      <Skeleton variant='rounded' animation = "wave" width={400} height={200} sx={{ bgcolor: 'grey.800' }}/>
                    </>
                  )
                  
                }
            </div>
    </LoggedInContainer>
  )
}

export default LikeSongs