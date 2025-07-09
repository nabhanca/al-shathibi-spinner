import React, { useContext, useEffect, useState } from 'react'
import './popup.css'
import { useNavigate } from 'react-router-dom';
import { CandidateContextProvider } from '../../Context/CandidatesContext';
import { IoClose } from "react-icons/io5";
import { images } from '../../assets/Images';
import typo from '../../assets/img25/typo.webp'
import v3 from '../../assets/img25/v3.png'
import Cookies from "js-cookie";

const Popup = ({spinData,tossData,isSpinData,isToss ,setIsPopup,isPopup}) => {

  const [img,setImg]=useState()
  const [user,setUser]=useState()
    const navigate=useNavigate()
  var userCokie= Cookies.get("user");
 
 console.log(user,'usercookie');
 

    const {updateSub,updateCandidate}=useContext(CandidateContextProvider)

    useEffect(()=>{
      if(spinData){

        getImg()

      }
    },[spinData])

useEffect(() => {
  const raw = Cookies.get('user');
  if (raw) setUser(JSON.parse(raw));
}, []);

  const getImg=async()=>{
      const imagee= images.find((item)=>{
          return item.id===spinData.st
  
        })
        console.log(imagee,'f');
        setImg(imagee.img)
  }

    const handleSub=()=>{
    updateSub(tossData)
    navigate(`/img/${tossData.candidateCode}`)
    }

    const handleFianlRound=()=>{
   navigate(`/toss/${spinData.st}`)
   setIsPopup(false)
    }

    const handleToss=()=>{
    if(user.email=='finalspin@gmail.com'){
      handleFianlRound()
    }
     if(user.email=='secondspin@gmail.com'){
      handleSecondRound()
    }
    }

    const handleSecondRound = () => {
    updateCandidate(spinData.id)

    navigate(`/img/${spinData.st}`)
    // setSorted([])

    setIsPopup(false)

  }
  return (
    <div>
        <div className="popup">   
          {spinData? 
          <div data-aos="zoom-in-up">

            <div className="bg-[#fdf9ee] relative overflow-hidden flex flex-col justify-center items-center py-5 px-10 rounded-4xl shadow-2xl">
              <img src={typo} className='w-50 pt-2' alt="" />
              <span className='absolute top-8 right-8 z-5 bg-[#736153] text-white p-1 rounded-full' onClick={() => setIsPopup(false)}><IoClose /></span>

              <img src={v3} className='w-150 absolute z-1 -top-100 animate-[spin_35s_linear_infinite]' alt="" />
              <div className=" flex items-center justify-between gap-8 ">
                <img src={img} className='shadow-[0_5px_15px_rgba(0,0,0,0.35)]  border-6 shadow-4xl border-[#736153] w-40 h-40 object-cover rounded-full' alt="" />
                <div className="flex flex-col ">
                  <h1 className='font-bold text-3xl uppercase  leading-5'>{spinData.st} <br></br> <span className='text-sm font-normal '>{spinData.name}</span></h1>
                  <p className='!mt-3'>PLACE: <span className=' !pl-1 uppercase font-medium'>{spinData.place}</span> </p>
                  <div className="flex items-start gap-1">
                    <span className="whitespace-nowrap ">INSTITUTION:</span>
                    <span className="uppercase w-50 font-medium break-words">{spinData.institution}</span>
                  </div>

                </div>

              </div>
                <button className='bg-[#736153] text-white self-end mr-10 mt-4 py-1 px-8 rounded-full' onClick={handleToss}>Next</button>

            </div>
          </div>
          
          :
          <div data-aos="zoom-in-up">
        <div className="bg-[#fdf9ee] min-w-120 relative overflow-hidden flex flex-col justify-center items-center py-5 px-10 rounded-4xl shadow-2xl">
              <img src={typo} className='w-60 pt-2' alt="" />
              {/* <span className='absolute top-8 right-8 z-5 bg-[#736153] text-white p-1 rounded-full' ><IoClose /></span> */}

              <img src={v3} className='w-150 absolute z-1 -top-100 animate-[spin_35s_linear_infinite]' alt="" />
              <div className=" flex items-center justify-between gap-8 mt-8">
              <p className='arabic text-3xl'>{tossData.sub}</p>
              </div>
                <button className='bg-[#736153] text-white self-end mr-4 mt-6 py-1 px-8 rounded-full' onClick={handleSub}>Next</button>

            </div>
      </div>
}
       </div>
    </div>
  )
}

export default Popup