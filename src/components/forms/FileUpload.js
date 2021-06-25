import React from 'react'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Avatar, Badge } from 'antd'

const FileUpload = ({ values, setValues, setLoading }) => {
    const { user } = useSelector(state => ({ ...state }))

    const fileUploadAndResize = (e) => {
        //get files
        const files = e.target.files
        let allUploadedFiles = values.images

        if (files) {
            setLoading(true);
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        // console.log(uri);
                        axios
                            .post(
                                `${process.env.REACT_APP_API}/uploadimages`,
                                { image: uri },
                                {
                                    headers: {
                                        authtoken: user ? user.token : "",
                                    },
                                }
                            )
                            .then((res) => {
                                //console.log("IMAGE UPLOAD RES DATA", res);
                                setLoading(false);
                                allUploadedFiles.push(res.data);

                                setValues({ ...values, images: allUploadedFiles });
                            })
                            .catch((err) => {
                                setLoading(false);
                                //console.log("CLOUDINARY UPLOAD ERR", err);
                            });
                    },
                    "base64"
                );
            }
        }
    }
    
    const removeHandler = (public_id) => {
        setLoading(true)
        //Remove image from cloudinary and from state
        //We are not sending delete request because we are using cloudinary.uploader.destroy in the backend , for that we need only the public_id  which is in the req.body of post request 
        axios.post(`${process.env.REACT_APP_API}/removeimage`, {public_id}, {
            headers: {
                authtoken: user ? user.token : ''
            }
        })
            .then(res =>{
                setLoading(false)
                const {images} = values
                let filteredImages = images.filter(item => item.public_id !== public_id)
                setValues({...values, images: filteredImages})
            })
            .catch(e => {
                setLoading(false)
            })
    }

    return (
        <>
            <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              count="X"
              key={image.public_id}
              onClick={() => removeHandler(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="ml-3"
              />
            </Badge>
          ))}
      </div>

            <div className="row">
                <label className="btn btn-primary btn-raised mt-3">Choose File
            {/* images/* sve sto je slika, png, jpg... */}
                    <input hidden type="file" multiple acceot="images/*" onChange={fileUploadAndResize} />
                </label>
            </div>
        </>
    )
}

export default FileUpload
