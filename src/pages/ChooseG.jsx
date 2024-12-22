import Button from "../components/Button"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../components/Header";
export default function ChooseG(){
    const navigate = useNavigate();
    const { Id , floorId } = useParams();
    const handleChange = (gender)=>{
        navigate(`/${Id}/${floorId}/${gender}`);
    }
    return (
        <>
          <Header />
          <div className='container'>
              <button onClick={()=>handleChange('MT')} className="btn"><h1>Male</h1></button>
              <button onClick={()=>handleChange('FT')} className="btn"><h1>Female</h1></button>
          </div>
        </>
      )
}