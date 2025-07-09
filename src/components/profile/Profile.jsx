import React, { useEffect, useState } from 'react'
import v1 from '../../assets/img25/v1.webp'
import typo from '../../assets/img25/typo.webp'
import first from '../../assets/img25/first.webp'
import second from '../../assets/img25/second.webp'
import third from '../../assets/img25/third.webp'
import v3 from '../../assets/img25/v3.png'
import bg from '../../assets/images/bg.png'
import v2 from '../../assets/images/vbig.png'
// import img from '../../assets/user/ST201.jpg'
import { images } from '../../assets/Images'
import { useNavigate } from 'react-router-dom'

const Profile = ({userData}) => {

     const [img,setImg]=useState()
     const [raviQuestion,setRaviQuestions]=useState()
     const [uloomQuestions,setUloomQuestions]=useState()
     const navigate=useNavigate()
      console.log(userData,'usernew');
      useEffect(()=>{
          getImg()
      },[userData])

      useEffect(()=>{
       if(userData){
       
       }
      },[])
  
      const getImg=async()=>{
          const imagee= images.find((item)=>{
              return item.id===userData.code
      
            })
            console.log(imagee,'f');
            setImg(imagee.img)
      }

      const handleNavigate=()=>{
        navigate(`/question/${userData.code}`,{state:{ravi:userData.ravi,raviCode:userData.raviId}})
      }

  return (
    <div className="bg-[#e9e5df] h-screen !overflow-hidden relative "  >
    <div className="absolute inset-0  z-1 opacity-50 "  style={{ backgroundImage: `url(${bg})` }}></div>
      <img src={v3} className='fixed w-[1200px] z-8 -bottom-[700px]  left-1/2 -translate-x-1/2 animate-[spin_35s_linear_infinite]' alt="" />
       
      {/* <img src={bg} className='absolute h-screen object-cover top-0 bottom-0 left-0 right-0 w-full opacity-50' alt="" /> */}
      <img src={v1} className='fixed -top-60 -left-60' alt="" />
      <img src={v1} className='fixed -top-60 -right-60' alt="" />
      <div className="!mt-[40px] flex flex-col  h-full relative z-10">

        <div className="flex gap-8 -mt-8 justify-center items-center ">
        <img src={typo} className='w-80 ' alt="" />
        <div className="flex gap-6">
           <img src={second} className='w-25 h-25 object-cover' alt="" />
           <img src={first}  className='w-25 h-25 object-cover scale-115' alt="" />
           <img src={third}  className='w-25 h-25 object-cover' alt="" />
        </div>
        </div>

        <div className="flex gap-6 !mt-2">
          <div className="w-1/2 bg-[#ab9c90] rounded-r-full arabic text-right text-white !py-3 text-2xl !px-6"> {userData.ravi}</div>
          <div className="w-1/2 bg-[#736153] rounded-l-full arabic text-white !py-3 text-2xl !px-6"> {userData.finalroundsurah? userData.finalroundsurah:userData.secondroundsurah}</div>
        </div>

        <div className="w-2/3 mt-15 overflow-hidden relative bg-[#fef5ee] self-center flex justify-center gap-15 items-end shadow-[0_5px_15px_rgba(0,0,0,0.35)]  rounded-t-[70px] grow-1 !px-30">
        <img src={v2} className='absolute -top-40 -left-40 w-130 z-1 opacity-65' alt="" />
        <div className="w-1/2 flex justify-end z-10 relative">
        <div className="w-55 h-80 bg-[#c5ae9c] rounded-t-full flex justify-center border-4 shadow-2xl border-white ">
          <img src={img&&img} className='w-35 h-35 rounded-full  object-cover !-mt-20 border-6 shadow-4xl border-[#736153]' alt="" />
        </div>
        </div>
        <div className="w-2/3 h-70 z-10 relative !mb-35">
          <p className='text-2xl'>STB NO: <span className=' !pl-1 uppercase text-2xl font-medium'>{userData.code}</span> </p>
          <h1 className='font-bold text-3xl  uppercase  leading'>{userData.name} </h1>
          <p className='-mt-2 text-sm'>{userData.place}</p>
          <p className='!mt-3'>STB NO: <span className=' !pl-1 uppercase font-medium'>{userData.code}</span> </p>
<div className="flex items-start gap-1">
  <span className="whitespace-nowrap ">INSTITUTION:</span>
  <span className="uppercase font-medium break-words">{userData.institution}</span>
</div>
<div className="flex mt-4">
  <button className='bg-[#c5ae9c] px-4 py-1 rounded-3xl arabic' onClick={handleNavigate}>الأسئلة</button>
</div>

        </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
