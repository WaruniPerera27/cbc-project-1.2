const url = "https://pxigmkjedingvbbhjtpn.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWdta2plZGluZ3ZiYmhqdHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTMxODgsImV4cCI6MjA2ODEyOTE4OH0.L7JguRNgefq5n8-2GYLQODNgs5S5w8_BF-c7rufH3xQ";

import { createClient } from "@supabase/supabase-js";
import { toast } from "react-hot-toast"; // assuming you use react-hot-toast

// Create Supabase client
const supabase = createClient(url, key);

export default function UploadFile(file) {  //  pass file as parameter

    const promise = new Promise((resolve, reject) => {
        if (file == null) {
            toast.error("Please select a file to upload.");
            reject("No file selected");
            return; // stop further execution
        }

        const timeStamp = new Date().getTime();
        const fileName = timeStamp + "-" + file.name;

        supabase.storage.from('images').upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        }).then(({ error }) => {  // destructure error from response
            if (error) {
                console.error("Error during file upload:", error);
                toast.error("An error occurred during file upload.");
                reject(error);
            } else {
                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                const publicUrl = data.publicUrl;
                console.log("Public URL: ", publicUrl);
                toast.success("File uploaded successfully!");
                resolve(publicUrl);
            }
        }).catch((error) => {
            console.error("Unexpected error during file upload:", error);
            toast.error("An unexpected error occurred. Please try again.");
            reject(error);
        });
    });

    return promise;
}
