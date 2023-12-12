import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoggedInContainer from '../Containers/LoggedInContainer';
import SingleSongCard from '../Components/shared/SingleSongCard';
import { makeAuthenticatedGETRequest } from '../utils/serverHelpers';

function SinglePlaylistView() {
    const {playlistId} = useParams();
    const [playlistDetails,setPlaylistDetails]= useState({});

    useEffect(() =>{
        const getData = async () =>{
            const response = await makeAuthenticatedGETRequest(
                "/playlist/get/playlist/"+playlistId
            )
            setPlaylistDetails(response.data)
        }
        getData()
    },[])
    //console.log('playlistDetails',playlistDetails);
  return (
    <LoggedInContainer curActiveScreen={'library'}>
        {   playlistDetails._id &&
                (<div>
                        <div className='text-white text-xl pt-8 font-semibold'>
                        {playlistDetails.name}
                    </div>
                    <div className='pt-10 space-y-3'>
                    {playlistDetails.songs.map(item=>{
                                return <SingleSongCard 
                                info = {item} 
                                key = {JSON.stringify(item)}
                                playSound={() => {}}
                                />
                            })}  
                    </div>
                </div>)
         }
    </LoggedInContainer>
  )
}

export default SinglePlaylistView