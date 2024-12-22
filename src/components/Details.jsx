import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {CircularProgress, Backdrop} from '@mui/material';
import Cookie from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontWeight: 700,
        fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 17,

    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {

    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 1,
    },
}));


export default function Details() {

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(Cookie.get('uuid'));
    useEffect(() => {
        async function GetData() {
            try {
                setLoading(true);
                const res = await fetch(`https://backend.ankitkumar143872.workers.dev/api/v1/admin/get-cleaners`, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookie.get('uuid')}`
                    }
                });
                const resData = await res.json();
                if (!res.ok) {
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
                    
                    
                    resData.map((el, i) => {
                        el.buildingBlocks.map((el2, i) => {
                            setList((prev) => {
                                el2.building_name = el.building_name;
                                const updated = [...prev, el2];
                                return updated;
                            })
                        })
                    })
                    setLoading(false);

                    
                
            } catch (err) {
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
                setLoading(false);
                return;
                
            }
        }
        GetData();
    }, [])
    return (
        <>
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

            <div id="bar-sider" className="list">
                <div className=" mt-3 text-3xl font-semibold leading-30 pb-10">
                    List of Sweeper
                </div>
                <div className="list-detail">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell >Name</StyledTableCell>
                                    <StyledTableCell >Mobile Number</StyledTableCell>
                                    <StyledTableCell >Building</StyledTableCell>
                                    <StyledTableCell >Block</StyledTableCell>
                                    <StyledTableCell >Current Rating</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list.length > 0 && list?.map((row, i) => (
                                    <StyledTableRow key={i}>
                                        {/* <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell> */}


                                        {row.cleaner ?<StyledTableCell >{row.cleaner.user.name}</StyledTableCell>:<StyledTableCell >Null</StyledTableCell>}
                                        {row.cleaner ?<StyledTableCell >{row.cleaner.user.username}</StyledTableCell>:<StyledTableCell >Null</StyledTableCell>}
                                        <StyledTableCell >{row.building_name}</StyledTableCell>
                                        <StyledTableCell >{row.block.block_name}</StyledTableCell>
                                        {row.cleaner ?<StyledTableCell >{row.cleaner.rating.total}</StyledTableCell>:<StyledTableCell >Null</StyledTableCell>}

                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

        </>
    )
}