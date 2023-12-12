import React, { useContext } from 'react'
import songContext from '../../contexts/songContext';

function SingleLikedSong({info}) {
  const {currentSong,setCurrentSong,soundPlayed} = useContext(songContext);
  //console.log(info);
  return (
         <div className='bg-black bg-opacity-40 w-2/3 p-4 rounded-2xl hover:opacity-30' onClick={() => setCurrentSong(info)}>
                <div className='pb-4 pt-2'>
                    <img className=' w-28 rounded-md'
                    src = {info.thumbnail}
                    alt='Label'
                    />
                </div>
                <div className='text-white font-semibold py-3'>{info.name}</div>
                <div className='text-gray-500 text-sm'>{info.artist.firstName+" "+info.artist.lastName}</div>
        </div> 
  )
}

export default SingleLikedSong