import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CandidateContextProvider } from '../Context/CandidatesContext'
import User from '../components/user/User'
import Loader from '../components/loder/Loader'
import Profile from '../components/profile/Profile'

const Display = () => {
  
  const [display,setDisplay]=useState({})
  const [is,setIs]=useState(false)
  const {allCandidates}=useContext(CandidateContextProvider)
  const {id}=useParams()
  const navigate=useNavigate()

  useEffect(()=>{
 getSelect()

  },[allCandidates])

  const getSelect=async()=>{
       
      const SelectedCandidate=await allCandidates.find((item)=>{
        return item.code==id

      })

      if(SelectedCandidate){
        setDisplay(SelectedCandidate)
        setIs(true)
      }
     

  }
  console.log(id,allCandidates,display);
  return (
    <>
   {is && display?
    <div>
      <Profile userData={display}/>
    </div>:
    <div>
      <Loader/>
    </div>
}
    </>

    
  )
}

export default Display