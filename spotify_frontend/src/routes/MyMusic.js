import React, { useEffect, useState } from 'react'
import SingleSongCard from '../Components/shared/SingleSongCard'
import { makeAuthenticatedGETRequest } from '../utils/serverHelpers'
import LoggedInContainer from '../Containers/LoggedInContainer'
import { Skeleton } from '@mui/material';

const MyMusic = () =>{
    const [songData,setSongData] = useState([]);

    useEffect(()=>{
                 const getData = async () =>{
                     const response = await makeAuthenticatedGETRequest('/song/get/mysongs')
                     setSongData(response.data)
                 }
                 getData();
             },[])

    return(
        <LoggedInContainer curActiveScreen="myMusic">
            <div className='text-white text-xl font-semibold pb-4 pl-2 pt-8'>My Songs</div>
                 <div className='space-y-3 overflow-auto'>
                    {songData.length>0 ? (songData.map(item=>{
                        return(
                            <SingleSongCard 
                                info = {item} 
                                playSound = {() =>{}}
                            />
                        )
                    })):
                    (<div className='flex flex-col py-10 space-y-5'>
                        <Skeleton variant='rounded' animation = "wave" width={1000} height={40} sx={{ bgcolor: 'grey.800' }}/>
                        <Skeleton variant='rounded' animation = "wave" width={1000} height={40} sx={{ bgcolor: 'grey.800' }}/>
                        <Skeleton variant='rounded' animation = "wave" width={1000} height={40} sx={{ bgcolor: 'grey.800' }}/>
                    </div>)
                    }
                 </div>
        </LoggedInContainer>
    )
}


export default MyMusic