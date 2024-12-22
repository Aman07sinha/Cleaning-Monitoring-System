import { useState, useEffect } from 'react';
import { TextField, InputLabel, MenuItem, FormControl, Select, OutlinedInput, IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Form, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Cookie from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CircularProgress, Backdrop} from '@mui/material';

export default function Assignment() {
    const [object, setObject] = useState({
        gender: '',
        building: '',
        block: '',
    });

    const [Block, setBlock] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [istrue, settrue] = useState(false);
    const { userData } = useAuth();
    const [final, setFinal] = useState(userData);
    const [Building, setBuilding] = useState([]);
    const [loading , setLoading] = useState(false);

   

    useEffect(() => {
        setLoading(prev=> !prev);
        fetch("https://backend.ankitkumar143872.workers.dev/api/v1/admin/get-building-details", {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookie.get('uuid')}`
            }
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
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
                    setLoading(prev=> !prev);
                    return;
                }
                
                setBuilding(data);
                setLoading(prev=> !prev);
            }).catch(err => {
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
            })
    }, []);

   

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (event) => {
        setObject(prevobject => {
            const updated = { ...prevobject };
            updated.gender = event.target.value;
            return updated;
        });
    };
    const handleChangeBuilding = (event) => {
        console.log(event.target.value);
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
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const formJson = Object.fromEntries(form.entries());
        formJson.building_id = Building[object.building].id;
        formJson.block_id = Block[object.block].block.id;
        formJson.gender = formJson.Gender == 1 ? 'F' : 'M'
        setLoading(prev => !prev);
        try{
                
                const res = await fetch(`https://backend.ankitkumar143872.workers.dev/api/v1/admin/assign-cleaner`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookie.get('uuid')}`
                    },

                    body: JSON.stringify(formJson)
                })
                const resData = await res.json();
                
                if (!res.ok) {
                    setLoading(prev=> !prev);
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

                
                setLoading(prev=> !prev);
                toast.success(resData.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                
        }catch(err){
            setLoading(prev=> !prev);
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
        }


    };

    return (<>
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
        <div id="bar-sider">
            
            <div className="ml-10 mt-3 text-4xl font-bold pb-10">
                Assign a Sweeper
            </div>
            <div className='login-form' >
                <div className='form'>
                    <Form method='post' onSubmit={handleSubmit}>
                        <TextField sx={{ marginTop: 2 }} required fullWidth id="outlined-basic" label="Enter Name" variant="outlined" name='name' />
                        <FormControl required sx={{ marginTop: 2, minWidth: 120 }} fullWidth >
                            <InputLabel id="demo-simple-select-autowidth-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={object.gender}
                                onChange={handleChange}
                                autoWidth
                                label="Age"
                                name='gender'
                            >
                                <MenuItem sx={{ minWidth: 120 }} value={0}>Male</MenuItem>
                                <MenuItem sx={{ minWidth: 120 }} value={1}>Female</MenuItem>
                            </Select>
                        </FormControl>
                        <div className='flex justify-between'>
                            <FormControl sx={{ marginTop: 2, width: '50%' }} required >
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
                            <FormControl sx={{ marginTop: 2, minWidth: '45%' }} required >
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
                        </div>
                        <TextField
                            label="Mobile Number"
                            id="outlined-start-adornment"
                            sx={{ marginTop: 2 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            fullWidth
                            required
                            name='username'
                        />
                        <TextField required fullWidth sx={{ marginTop: 2 }} id="outlined-basic" label="Set Password" variant="outlined" name='password' />
                        <FormControl required fullWidth sx={{ marginTop: 2 }} variant="outlined" >
                            <InputLabel htmlFor="outlined-adornmentpassword">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornmentpassword"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirm Password"
                                name='confirm_password'
                            />
                        </FormControl>
                        <button type='submit' className='btn'>Create</button>

                    </Form>


                </div>
            </div>
        </div>
        </>
    )
}