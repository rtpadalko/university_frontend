import React from "react";
import "./UploadButton.css"

const UploadButton = ({handleFileChange}) => {
    return (
        <div className="file btn btn-lg btn-primary upload-file-container">
            Загрузить
            <input type="file" accept="image/*" name="file" onChange={handleFileChange} />
        </div>
    )
}

export default UploadButton