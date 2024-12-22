import Button from "./../components/Button";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

export default function ChooseT() {
  const { Id, floorId, gender } = useParams();
  const [washroomDetails, setWashroomDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("this is useEffect from ChooseT");
    fetch(
      `https://backend.ankitkumar143872.workers.dev/api/v1/cleaner/get-washrooms`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookie.get("uuid")}`,
        },
        body: JSON.stringify({ floorId }),
      }
    )
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          toast.error("Wrong Phone Number or Password", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }

        setWashroomDetails(json.washrooms);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const washroomGenderList = washroomDetails.filter((washroom) =>
    washroom.washroom_name.startsWith(gender)
  );

  const handleClick = (Tid, index) => {
    navigate(`/${Id}/${floorId}/${gender}/${index + 1}/${Tid}`);
  };

  return (
    <>
      <Header />
      <div className="container">
        {washroomGenderList.map((el, index) => {
          return (
            <button
              key={index}
              onClick={() => handleClick(el.id, index)}
              className="btn"
            >
              {el.washroom_name}
            </button>
          );
        })}
      </div>
    </>
  );
}
