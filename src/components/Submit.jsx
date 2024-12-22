import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
import {CircularProgress, Backdrop} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

export default function Submit( {data, ids ,setData }) {
  const [loading,setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const path_name = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  return (
    <>
     
      <Button variant="outlined" onClick={handleClickOpen}>
        Submit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => { 
            event.preventDefault();
            setLoading(prev=> !prev);
            const formData = {...data}
            formData.washrooms = ids;
           
           
            try{
                    
                    const res = await fetch(`${path_name}/api/v1/admin/verify`,{
                      method : 'POST',
                      headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${Cookie.get('uuid')}`
                      },
                      body : JSON.stringify(formData)
                    })
                    const resData = await res.json();
                    if(!res.ok){
                        toast.error(resData.msg, {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                      });
                      setLoading(prev=> !prev);
                      return;
                    }
                    setLoading(prev=> !prev);
                    toast.success('Successfully Submitted', {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                  });
                  setTimeout(()=>{
                        handleClose();
                        setData(prev=> {
                          const updated = [{
                              id : resData.id,
                              isSubmitted: resData.isSubmitted,
                              location : {
                                washrooms : [...resData.location.washrooms]
                              }
                          }];
                          return updated;
                        });
                        handleClose();
                        navigate('/admin/verify');
                  },5000);
                    
          }catch(err){
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
              setLoading(prev=> !prev);
          }

            
          },
        }}
      >
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>
        <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
            />
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress />
          </Backdrop>
          
            
          <DialogContentText>
             Do you want to Submit it?
          </DialogContentText>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}