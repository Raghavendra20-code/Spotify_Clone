import React, { useState } from 'react'
import TextInput from '../Components/shared/TextInput'
import { makeAuthenticatedPOSTRequest } from '../utils/serverHelpers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreatePlaylistModal({closeModal}) {

    const[playlistName,setPlaylistName]  = useState("");
    const[playlistThumbnail,setPlaylistThumbnail]  = useState("");

    const createPlaylist = async () =>{
        const response = await makeAuthenticatedPOSTRequest(
            "/playlist/create",
            {name:playlistName,thumbnail:playlistThumbnail,songs:[]}
            )
        if(response._id){
            toast('PlayList Created Successfully!', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            closeModal();
        }
    }

  return (
    <div className='absolute bg-black w-screen h-screen bg-opacity-50 flex justify-center items-center' onClick={closeModal}>
        <div className='bg-app-black w-1/3 rounded-md p-8' onClick={e=>e.stopPropagation()}>
            <div className='text-white mb-5 font-semibold text-lg'>Create Playlist</div>
            <div className='space-y-4 flex flex-col jutify-center items-center'>
                    <TextInput 
                        label={"Thumbnail"} 
                        labelClassName={"text-white"}
                        placeholder={"Thumbnail"}
                        value={playlistThumbnail}
                        setValue={setPlaylistThumbnail}
                    />
                    <TextInput 
                        label={"Name"} 
                        labelClassName={"text-white"}
                        placeholder={"Playlist Name"}
                        value={playlistName}
                        setValue={setPlaylistName}
                    />
                    <div 
                        className='bg-white w-1/3 rounded flex font-semibold justify-center items-center py-3 mt-4 cursor-pointer'
                        onClick={createPlaylist}
                    >Create
                    </div>
            </div>
        </div>
    </div>
  )
}

export default CreatePlaylistModal