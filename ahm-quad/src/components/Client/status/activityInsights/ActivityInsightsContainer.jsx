import React, { useEffect, useState } from 'react'
import ActivityInsightsCompoenent from './ActivityInsightsCompoenent'
import { useParams } from 'react-router-dom'
import { usePost } from '../../../../hooks/usehttp'

function ActivityInsightsContainer() {
  const accesToken=localStorage.getItem('token')
  const {workshop_id}=useParams()
  const {postRequest}= usePost()
  const [assets, setassets] = useState([])
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const fetchasset = async()=>{
     
      try {
        const response = await postRequest(
          `/company/fetchasset/${workshop_id}`,
          {},
          accesToken
        );
        // // console.log(response);
        setassets(response.data)
      } catch (error) {
        console.error(error);
      }
      
    }
    
    // fetchasset()
   
  }, [])
  
  return (
<>
{isMounted?  (<div className='bg-white w-full mt-3 h-auto pt-5 pb-8 px-6 rounded-[7px] relative'>
        <p className='font-[500]'>Motor Activity Insights</p>
        <div>
            <ActivityInsightsCompoenent assets={assets}/>
        </div>
    </div>):""}
</>
  )
}

export default ActivityInsightsContainer
