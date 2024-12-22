import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useState} from 'react';
import Submit from './Submit';
import { Form } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

import Search from './Search';

export default function Verify() {

    const [data, setData] = useState([{
        isSubmitted: true,
        location: {
            washrooms: [],
        },
        date: ''
    }]);
    const [obj,setObj]= useState({
        state_id:'',
        building_id: '',
        block_id: '',
        floor_id: '',
    })
    const [summ, setSumm] = useState([]);
    
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const [washid, setWash] = useState(new Set());

    const handleClick = (id) => {
        if (washid.has(id)) {
            setWash(prev => {
                const updated = new Set(prev);
                updated.delete(id);
                return updated;
            })
        } else {
            setWash(prev => {
                const updated = new Set(prev);
                updated.add(id);
                return updated;
            })
        }
    }
    const [ids, setIds] = useState([]);


    const handleButton = () => {
        setIds(prev => {
            const myArray = Array.from(washid);
            return myArray;
        });
        setObj(prev => {
            const updated = { ...prev };
            updated.state_id = data[0].id;
            updated.building_id = data[0].location.buildingBlock.building.id;
            updated.block_id = data[0].location.buildingBlock.block.id;
            updated.floor_id = data[0].location.floor.id;
            const split = data[0].date.split('T');
            updated.date = split[0];
            return updated;
        })
    }



    return (
        <>
            <div id="bar-sider">
                <div>

                    <Search setData={setData} setWash={setWash} setSumm={setSumm} />
                    <div className='summary'>
                        {
                            summ && summ.map((el, i) => {
                                return (
                                    <ul key={i}>
                                        <li className='flex gap-x-5'><p className='font-semibold text-2xl'>Building:</p> <p className='font-medium text-2xl text-slate-500'>{el.building_name}</p></li>
                                        <li className='flex gap-x-5'><p className='font-semibold text-2xl'>Block:</p> <p className='font-medium text-2xl text-slate-500'>{el.block_name}</p></li>
                                        <li className='flex gap-x-5'><p className='font-semibold text-2xl'>Floor:</p> <p className='font-medium text-2xl text-slate-500'>{el.floor_name}</p></li>
                                        <li className='flex gap-x-5'><p className='font-semibold text-2xl'>Building:</p> <p className='font-medium text-2xl text-slate-500' >{el.date}</p></li>
                                    </ul>
                                )
                            })
                        }
                    </div>
                    <div className='verifyphoto'>
                        <Form>
                            {
                                data[0].location.washrooms.length > 0 && data[0].location.washrooms.map((el, i) => {
                                    return (
                                        <div className='one-verify' key={i}>
                                            <Accordion sx={{ width: '80%', color: 'success' }} key={i} expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)} >
                                                <AccordionSummary key={i}
                                                    expandIcon={<ArrowDownwardIcon />}
                                                    aria-controls="panel1-content"
                                                    id="panel1-header"
                                                >
                                                    <div className='flex gap-x-20 w-5/6 justify-between items-center '>
                                                        <p className='font-bold text-xl'>{el.washroom_name}</p>

                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails >
                                                    <div className='imageclass'>
                                                        {
                                                            el.status.length > 0 && el.status.map((el1, i1) => {
                                                                return <img key={i1} src={el1.imageUrl} />
                                                            })
                                                        }
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                            {data[0].isSubmitted ? (el.cleaningStatus.length > 0 && el.cleaningStatus[0].cleaned ? <AddTaskIcon size='large' color='success' /> : <CancelIcon color='error' size='large' />) : (el.status.length !== 0) ? <Checkbox
                                                checked={washid.has(el.id)} onChange={() => handleClick(el.id)} /> : <input type='checkbox' disabled />}
                                        </div>);

                                })
                            }
                        </Form>
                    </div>

                    {!data[0].isSubmitted && <div className='submit' onClick={handleButton}><Submit data={obj} ids={ids} setData={setData} /></div>}
                </div>
            </div>

        </>
    )
}