import { useEffect,useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import NavDropdown from 'react-bootstrap/NavDropdown';
export default function DropdownMenu(){
    const [BuildingData,setBuildingData]=useState([]);
    useEffect(()=>{
        const data = {
            username: "9661322599",
            password: "Manit@123"
        }

        async function fetchData(){
           try{
            const res = await fetch(`https://backend.ankitkumar143872.workers.dev/api/v1/user/signin`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(data)
            });
            
            const resData = await res.json();
            console.log(resData);
            setBuildingData(resData.details.buildings);
           }
           catch(err){
             console.log(err);
           }
  
      }
      fetchData();
    },[])
    return (
        <nav>
        <ul>
        <li> 
         <label htmlFor="drop-2" className="toggle">Buildings</label>
          <a href="#">Buildings</a>
          <input type="checkbox" id="drop-2"/>
          <ul>
            <li><a href="#">Portfolio 1</a></li>
            <li><a href="#">Portfolio 2</a></li>
            <li> 
              <label htmlFor="drop-3" className="toggle">Works +</label>
              <a href="#">Works</a>
              <input type="checkbox" id="drop-3"/>
                <ul>
                    <li><a href="#">HTML/CSS</a>
                      <ul>
                        <li>fjbgvf</li>
                      </ul>
                    </li>
                    <li><a href="#">jQuery</a></li>
                    <li><a href="#">Python</a></li>
                </ul>
             </li>
             {
                BuildingData.length > 0 && BuildingData.map((el,i1)=>{
                    return (
                        <li key={i1}>
                            <a href="#">{el.building_name}</a>
                            <ul>
                            {
                                el.buildingBlocks.map((el2,i2)=>{
                                    return (
                                        <li key={i2}>
                                            <a>{el2.block.block_name}</a>
                                            <ul>
                                                {
                                                    el2.buildingBlockFloors.map((el3,i3)=>{
                                                        return <li key={i3}><a>{el3.floor.floor_name}</a></li>
                                                    })
                                                }
                                            </ul>

                                        </li>
                                    )
                                })
                            }
                            </ul>
                            
                        </li>
                    )
                })
             }
         </ul>
        </li>
      </ul>
      </nav>
    )
}