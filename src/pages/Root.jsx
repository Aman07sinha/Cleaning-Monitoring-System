import { Outlet, useLoaderData, useSubmit } from 'react-router-dom';
import SideBar from '../components/Sidebar';
import Header from '../components/Header';

import { useEffect } from 'react';

export default function(){
    return <>
       <Header />
       <main id="sidebar">
         <SideBar />
         <Outlet />
       </main>
      
    </>
}