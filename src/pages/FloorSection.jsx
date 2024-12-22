import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Submit from "../components/Submit";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Cookie from "js-cookie";

export default function FloorSection() {
  const [floors, setFloors] = useState([]);
  const { Id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `https://backend.ankitkumar143872.workers.dev/api/v1/cleaner/get-floors`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookie.get("uuid")}`,
        },
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
        console.log(json.floors);
        setFloors(json.floors);
      })
      .catch((err) => {
        toast.error(err, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading((prev) => !prev);
      });
  }, []);

  const handleClick = (floor_id) => {
    navigate(`/${Id}/${floor_id}`);
  };

  return (
    <>
      <Header />
      <div className="container">
        {floors.map((element, index) => {
          return (
            <button
              key={index}
              onClick={() => handleClick(element.floor.id)}
              className="btn"
            >
              {element.floor.floor_name}
            </button>
          );
        })}
      </div>
    </>
  );
}
