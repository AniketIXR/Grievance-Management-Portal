import React, { useState, useContext, useEffect } from "react";
import "../styles/Card.css";
import axios from "axios";
import { HOST } from "../backend";
import { useNavigate } from "react-router-dom";
import loginContext from "../context/login/loginContext";
import { storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import imageCompression from "browser-image-compression";
import '../styles/NewComplaint.css';
import { toast } from 'react-toastify';

const NewComplaint = (props) => {
  const navigate = useNavigate();

  const contextLogin = useContext(loginContext);
  const { isLoggedIn } = contextLogin;

  const DEFAULT_STATE = {
    heading: "",
    body: "",
  };

  const [currPost, setCurrPost] = useState(DEFAULT_STATE);
  const [imageDataFiles, setImageDataFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const btnDisabled = currPost.heading.length === 0 ||
  currPost.body.length === 0 || uploading;

  useEffect(() => {
    if(isLoggedIn !== "loggedin")
      navigate("/");
  }, [])
  

  //Image uploading relaed functions: -------------------------------------------------
  const uploadToFirebase = async (compressedImageFiles) => {
    const USER_ID = localStorage.getItem("loggedInUserId");

    const urlPromises = [];
    const imgReferences = [];

    compressedImageFiles.forEach((imageFile, index) => {
      const currentRef = `${USER_ID}/${Date.now()}${index}`;
      const imageRef = ref(storage, currentRef);
      imgReferences.push(currentRef);
      const res = uploadBytes(imageRef, imageFile, {
        contentType: "image/jpeg",
      })
        .then((snapshot) => getDownloadURL(imageRef))
        .catch((error) => {
          console.log(error);
        });
      urlPromises.push(res);
    });
    const downloadURLs = await Promise.all(urlPromises);
    return {downloadURLs, imgReferences};
  };

  const compressImages = async (imageFiles) => {
    const compressedImageFilesPromises = [];

    const options = {
      maxSizeMB: 0.35,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      imageFiles.forEach((image) => {
        const task = imageCompression(image, options);
        compressedImageFilesPromises.push(task);
      });
    } catch (error) {
      console.log(error);
    }

    const result = await Promise.all(compressedImageFilesPromises);
    return result;
  };

  //Doing it here because it is almost isolated function:------------------------------
  const addNewPost = async(e) => {
    e.preventDefault();
    setUploading(true);
    const ENDPOINT = `/api/v1/posts`;
    const ADD_NEW_POST_ENDPOINT = `${HOST}${ENDPOINT}`;

    //First do the image compression:-----
    let uploadResult = {};
    if(imageDataFiles.length!==0){
      const compressedImages = await compressImages(imageDataFiles);
      uploadResult = await uploadToFirebase(compressedImages);
    }

    const postToBeAdded = imageDataFiles.length === 0 ? currPost : {...currPost, images: uploadResult.downloadURLs, imgRef: uploadResult.imgReferences};

    axios
      .post(ADD_NEW_POST_ENDPOINT,postToBeAdded , {
        withCredentials: true,
        credentials: "include",
      })
      .then((post) => {
        setCurrPost(DEFAULT_STATE);
        toast.success("Complaint Added Successfully");
        setUploading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong...");
        setUploading(false);
      });
      props.closeModal();
  };

  const handleChange = (e) => {
    setCurrPost({
      ...currPost,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    console.log(value);
    setCurrPost((prevPost) => ({
      ...prevPost,
      tags: value,
    }));
  };
  
  const handleImageChange = (e) => {
    const currentImageDataFiles = [];
    for (let i = 0; i < e.target.files.length; i++) {
      if(i===1) break;
      currentImageDataFiles.push(e.target.files[i]);
    }
    setImageDataFiles(currentImageDataFiles);
  };

  return (
    <div class='modal'>
      <article class="modal-container2">
        <div className="row justify-content-center">
          <div className="card card-shadow" style={{ maxWidth: "36rem" }}>
          <header class="modal-container-header2">
          <h1 class="modal-container-title2">Add a complaint</h1></header>
            <div className="card-body">
              <h6 className="card-title">Please specify the details:</h6>

              <form className="my-2">
                <div className="form-group my-3">
                  <h6 className="mx-1">
                    <label htmlFor="headingInput">Heading:</label>
                  </h6>
                  <input
                    type="text"
                    className="form-control"
                    id="headingInput"
                    aria-describedby="headingHelp"
                    placeholder="Enter title"
                    value={currPost.heading}
                    name="heading"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <h6 className="mx-1">
                    <label htmlFor="descriptionInput" className="form-label">
                      Description:
                    </label>
                  </h6>
                  <textarea
                    className="form-control"
                    id="descriptionInput"
                    rows="4"
                    value={currPost.body}
                    name="body"
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="descriptionInput" className="form-label">
                        Tag:
                  </label>
                  <select
                      className="form-select"
                      id="departmentInput"
                      aria-describedby="departmentHelp"
                      value={currPost.department}
                      name="department"
                      onChange={handleTagChange}
                      style={{marginBottom: '10px'}}
                    >
                      <option value={currPost.department}>Select..</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Academics">Academics</option>
                      <option value="Mess">Mess</option>
                      <option value="Finance">Finance</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                <div className="mb-3 d-block">
                  <h6 className="mx-1 d-inline">
                    <label htmlFor="descriptionInput" className="form-label">
                      Upload Images:
                    </label>
                    <input
                      multiple
                      type="file"
                      className="form-control"
                      id="image"
                      aria-describedby="imageHelp"
                      placeholder="Upload images"
                      name="imageUpload"
                      accept="image/jpeg"
                      onChange={handleImageChange}
                    />
                  </h6>
                </div>
                <footer class="modal-container-footer2">
                  <button className="button is-ghost" onClick={props.closeModal} style={{marginRight: '300px'}}>
                    Cancel
                  </button>
                  <button
                    className="button is-primary"
                    onClick={addNewPost}
                    disabled={btnDisabled}
                  >
                    {uploading?"Adding...":"Add now"}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewComplaint;
