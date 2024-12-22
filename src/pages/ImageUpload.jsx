import Header from "../components/Header";
import ImageInput from "./ImageInput";
import { useState } from "react";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import Cookie from "js-cookie";

export default function ImageUpload() {
  const cloud_name = import.meta.env.VITE_CLOUD_NAME;
  const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageData, setImageData] = useState([]);

  const navigate = useNavigate();
  const { Id, floorId, gender, Tid, Tnum } = useParams();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading((c) => !c);
      if (imageData.length) {
        let uploading = imageData.map(async (file) => {
          const image = new FormData();
          image.append("file", file);
          image.append("cloud_name", cloud_name);
          image.append("upload_preset", upload_preset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            {
              method: "post",
              body: image,
            }
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error("Something went wrong");
          }

          return data.secure_url;
        });
        const imageUrls = await Promise.all(uploading);
        console.log("this is all uploaded");
        console.log(imageUrls);

        const res = await fetch(
          `https://backend.ankitkumar143872.workers.dev/api/v1/cleaner/upload`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookie.get("uuid")}`,
            },
            body: JSON.stringify({
              washroomId: Tid,
              imageUrls,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        const data = await res.json();
        console.log(data);
        
        navigate(`/${Id}/${floorId}/${gender}`);

        setLoading((c) => !c);
      }
    } catch (err) {
      console.log(err);
      setLoading(c => !c);
    }
  }
  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} encoding={"multipart/form-data"}>
        <div>
          <ImageInput
            setSelectedFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
            setImageData={setImageData}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
      <Backdrop className="backdrop" open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
