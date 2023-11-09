import React, { useEffect, useRef, useState } from "react";

import { Button } from "@mui/material";
import s from "./style.module.css";

function FileUpload(props) {
  const { onInput } = props;
  const [file, setFile] = useState();
  // const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  // useEffect(() => {
  //   if (!file) {
  //     return;
  //   }

  //   const fileReader = new FileReader();
  //   fileReader.onload = () => {
  //     setPreviewUrl(fileReader.result);
  //   };
  //   fileReader.readAsDataURL(file);
  // }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0]; // get the file uploaded by user
      setFile(pickedFile);
      fileIsValid = true;
    } else {
      fileIsValid = false;
    }

    setIsValid(fileIsValid);
    if (fileIsValid) {
      // console.log(pickedFile);
      onInput(pickedFile);
    }
    // props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className={s.form_control}>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg,.pdf"
        onChange={pickedHandler}
      />
      <div className={`${s.file_upload} center`}>
        <Button variant="outlined" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {/* {!isValid && <p>{props.errorText}</p>} */}
    </div>
  );
}

export default FileUpload;
