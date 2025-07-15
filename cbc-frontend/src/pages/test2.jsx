import React, { useState } from 'react';
import toast from 'react-hot-toast';
import UploadFile from '../utils/mediaUpload';

export default function TestPage2() {
    
  const [file, setFile] = useState(null);

  function handleFileUpload() {
    
    UploadFile(file)
      .then((publicUrl) => {
        console.log("File uploaded successfully. Public URL:", publicUrl);
        toast.success("File uploaded successfully!");

      }).catch((error) => {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file. Please try again.");
      })
   
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-400 gap-4">
      <input accept="image/*"
        onChange={(e) => {
          console.log(e);
          console.log(e.target.files[0]);
          setFile(e.target.files[0]);
        }}
        type="file"  className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
      <button onClick={handleFileUpload} className="bg-blue-700 text-amber-50 px-4 py-2 rounded-md cursor-pointer">
        Upload
      </button>
    </div>
  );
}
