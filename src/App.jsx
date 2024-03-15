import React, { useRef, useState } from "react";
import "./style.css";

// import {upload} from "./images/upload"
// import "/src/style.css";

// const App = () => {
//   const inputRef = useRef(null);
//   const [image, setImge] = useState("");

//   const handleImageClick = () => {
//     inputRef.current.click();
//   };

//   const handleImageChange = (event) => {
//     const file = event;
//     console.log(file);
//     setImge(event.target.files[0]);
//   };

const App = () => {
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);
  // console.log(typeof useRef(),"useRef Datatype")

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imgName = file.name;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const maxSize = Math.max(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width)/2,
          (maxSize - img.height)/2
        );

        canvas.toBlob(
          (blob) => {
            const newFile = new File([blob], imgName, {
              type: "image/png",
              lastModified: Date.now(),
            });

            console.log(newFile);
            setImage(newFile);
          },
          "image/jpeg",
          0.8
        );
      };
    };

    reader.readAsDataURL(file);
  };

  const handleUploadButtonClick = () => {
    const myHeaders = new Headers();
    const token = "adhgsdaksdhk938742937423";
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formData = new FormData();
    formData.append("file", image);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    fetch("https://example.com/upload", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const profileUrl = result.img_url;
        setImage(profileUrl);
      })
      .catch((error) => console.log("error", error));
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <div className="image-upload-container">
      <div className="box-decoration">
        <label htmlFor="image-upload-input" className="logo-upload-label">
          {image ? image.name : "choose an image"}
        </label>

        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="upload"
              className="img-display-after"
            />
          ) : (
            <img src="./upload.jpg" alt="" className="img-display-before" />
          )}
          <input
            type="file"
            onChange={handleImageChange}
            ref={hiddenFileInput}
            style={{ display: "none" }}
          />
        </div>
        <button
          className="image-upload-button"
          onClick={handleUploadButtonClick}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default App;