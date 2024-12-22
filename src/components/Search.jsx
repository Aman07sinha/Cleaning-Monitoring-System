import { Button, Typography, TextField, InputLabel, MenuItem, FormControl, Select, OutlinedInput, IconButton, InputAdornment } from '@mui/material'
import { useState, useEffect } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Form } from 'react-router-dom';
import Cookie from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CircularProgress, Backdrop} from '@mui/material';
export default function Search({ setData , setWash, setSumm}) {

    const [object, setObject] = useState({
        building: '',
        block: '',
        floor: '',
        date : null,
    });

    const [value, setValue] = useState(null);


    const [Block, setBlock] = useState([]);
    const [Floor, setFloor] = useState([]);
    const [loading, setLoading] = useState(false);

    const path_name = import.meta.env.VITE_BACKEND_URL;
    

    
    const [Building, setBuilding] = useState([]);
    useEffect(() => {
        setLoading(prev => !prev);
    
        fetch(`${path_name}/api/v1/admin/get-building-details`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookie.get('uuid')}`
            }
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    setLoading(prev => !prev);
                    toast.error(data.msg, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    return;
                }
                
                setBuilding(data);
                setLoading(prev => !prev);
                
                
            }).catch(err => {
                setLoading(prev => !prev);
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
                
            })
    }, []);


    const handleChangeBuilding = (event) => {
        
        setObject(prevobject => {
            const updated = { ...prevobject };
            updated.building = event.target.value;
            return updated;
        });

        setBlock(Building[event.target.value].buildingBlocks);

    };
    const handleChangeBlock = (event) => {
        setObject(prevobject => {
            const updated = { ...prevobject };
            updated.block = event.target.value;
            return updated;
        });
        setFloor(Block[event.target.value].buildingBlockFloors);
    }

    const handleChangeFloor = (event) => {
        setObject(prevobject => {
            const updated = { ...prevobject };
            updated.floor = event.target.value;
            return updated;
        });
        
    }

    const handleFilter = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form.entries());
        formData.building_id = Building[object.building].id;
        formData.block_id = Block[object.block].block.id;
        formData.floor_id = Floor[object.floor].floor.id;
        const [month, day, year] = formData.date.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        const formattedYear = date.getFullYear();
        const formattedMonth = String(date.getMonth() + 1).padStart(2, '0'); 
        const formattedDay = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
        formData.date = formattedDate;
        
 
        setWash(new Set());
        setLoading(prev => !prev);

       try{
           const res= await fetch(`${path_name}/api/v1/admin/get-washrooms`,{
              method : 'POST',
              headers : {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${Cookie.get('uuid')}`
              }, 
              body : JSON.stringify(formData)
           });
           const resData = await res.json();
           console.log(resData);
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
            setObject({
                building: '',
                block: '',
                floor: '',
                date : null,
            });
            setSumm([]);
            setData(prev=>{
                const updated = [{
                    isSubmitted: true,
                    location: {
                        washrooms: [],
                    },
                    date: ''
                }];
                return updated;
             });
            setLoading(prev => !prev);
            setWash(new Set());
            return;
           }

           
           setObject({
            building: '',
            block: '',
            floor: '',
            date : null,
           });
           setData(prev=>{
            const updated = [...resData];
            return updated;
           });
           setWash(new Set());
           const split = resData[0].date.split('T');
           setSumm(prev=>{
               const updated = [{
                building_name : resData[0].location.buildingBlock.building.building_name,
                floor_name :resData[0].location.floor.floor_name, 
                block_name : resData[0].location.buildingBlock.block.block_name,
                date : split[0],
             }]
             return updated;
           })
           
           
           setLoading(prev => !prev);

       }catch(err){
        setLoading(prev => !prev);
        setSumm([]);
        setObject({
            building: '',
            block: '',
            floor: '',
            date : null,
        });
        setData(prev=>{
            const updated = [{
                isSubmitted: true,
                location: {
                    washrooms: [],
                },
                date: ''
            }];
            return updated;
           });
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
        return;
       }
        
    }
    return (
        <div >
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress />
          </Backdrop>
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

            <Form className='filter' method='post' onSubmit={handleFilter}>
                <FormControl sx={{ minWidth: '30%' }} required >
                    <InputLabel id="demo-simple-select-autowidth-label">Buildings</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={object.building}
                        onChange={handleChangeBuilding}
                        autoWidth
                        label="Buildings"
                        name='building_id'
                    >

                        {
                            Building.length > 0 && Building.map((el, i) => {
                                return (
                                    <MenuItem key={i} sx={{ minWidth: 120 }} value={`${i}`}>{el.building_name}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: '30%' }} required >
                    <InputLabel id="demo-simple-select-autowidth-label">Block</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={object.block}
                        onChange={handleChangeBlock}
                        autoWidth
                        label="Blocks"
                        name='block_id'
                    >
                        {
                            Block.length > 0 && Block.map((el, i) => {
                                return <MenuItem key={i} sx={{ minWidth: 120 }} value={i}>{el.block.block_name}</MenuItem>
                            })
                        }


                    </Select>
                </FormControl>
                <FormControl sx={{ width: '25%' }} required >
                    <InputLabel id="demo-simple-select-autowidth-label">Floor</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={object.floor}
                        onChange={handleChangeFloor}
                        autoWidth
                        label="Floors"
                        name='floor_id'
                    >
                        {
                            Floor.length > 0 && Floor.map((el, i) => {
                                return <MenuItem key={i} sx={{ minWidth: 120 }} value={i}>{el.floor.floor_name}</MenuItem>
                            })
                        }


                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer sx={{ marginTop: -1, }} components={['DatePicker']}>
                        <DatePicker name='date' value={object.date} onChange={(newValue) => {
                            setValue(newValue)
                            setObject(prev=>{
                                const updated = { ...prev}
                                updated.date = newValue;
                                return updated;
                            })
                        }} />
                    </DemoContainer>
                </LocalizationProvider>
                <Button type='submit' variant="outlined" size="large"> Search</Button>
            </Form>
        </div>)

}