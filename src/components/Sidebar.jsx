import { NavLink} from 'react-router-dom'
export default function SideBar(){
    return(
        <>
          <div className="side">
            <ul>
                <li className='p-1'>
                    <NavLink to={'/admin/assignment'} >Assign</NavLink>
                </li>
                <li>
                    <NavLink to={'/admin/details'} >Details</NavLink>
                </li>
                <li>
                    <NavLink to={'/admin/verify'} >Verify</NavLink>
                </li>
            </ul>
          </div>
        </>
    )
}