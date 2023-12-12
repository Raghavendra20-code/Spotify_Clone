import React, { useState } from 'react'
import spotify_logo from '../assets/images/spotify_logo_white.svg'
import IconText from '../Components/shared/IconText'
import { Icon } from '@iconify/react'
import TextWithHover from '../Components/shared/TextWithHover'
import TextInput from '../Components/shared/TextInput'
import CloudinaryUpload from '../Components/shared/CloudinaryUpload'
import { makeAuthenticatedPOSTRequest } from '../utils/serverHelpers'
import { useNavigate } from 'react-router-dom'
import LoggedInContainer from '../Containers/LoggedInContainer'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function UploadSong() {
    const [name,setName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [playlistUrl,setPlaylistUrl] = useState("");
    const [uploadedSongFileName,setUploadedSongFileName] = useState(null);
    const navigate = useNavigate();

    const submitSong = async () =>{
       
        const data = {
            name,
            thumbnail,
            track: playlistUrl
        }
        const response = await makeAuthenticatedPOSTRequest("/song/create",data);
        if(response.err){
            toast.error('Could not upload!', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            return;
        }
        toast('Song Uploaded!', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
        navigate('/home')
    }

    return(
        <LoggedInContainer curActiveScreen={'uploadMusic'}>
            <div className='main-content p-8 pt-0 overflow-auto'>
                <div className='text-2xl font-semibold mb-5 text-white mt-8'>
                    Upload Your Music
                </div>
                <div className='w-2/3 flex space-x-3'>
                    <div className='w-1/2'>
                        <TextInput 
                        label={"Name"} 
                        labelClassName={"text-white"}
                        placeholder={"Name"}
                        value={name}
                        setValue={setName}
                        />
                    </div>
                    
                    <div className='w-1/2'>
                        <TextInput 
                        label={"Thumbnail"} 
                        labelClassName={"text-white"}
                        placeholder={"Thumbnail"}
                        value={thumbnail}
                        setValue={setThumbnail}
                        />
                    </div>
                </div>
                <div className='py-5'>
                {   
                    uploadedSongFileName ?(
                        <div className='bg-white rounded-full p-3 mt-4 w-1/3'>
                            {uploadedSongFileName.substring(0,35)}...
                            </div>
                    ):(
                        <div className='pt-5'>
                            <CloudinaryUpload 
                            setUrl = {setPlaylistUrl} 
                            setName={setUploadedSongFileName}
                            />
                        </div>
                    )
                }
                </div>
                <div className='bg-white  w-40 flex items-center justify-center p-4 rounded-full cursor-pointer font-semibold' onClick={submitSong}>
                    Submit Song
                </div>
                
            </div>
        </LoggedInContainer>
    )
}



export default UploadSong