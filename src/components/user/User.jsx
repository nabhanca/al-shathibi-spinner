import React, { useEffect, useState } from 'react'
import './user.css'
import img1 from '../../assets/images/7.webp'
import { images } from '../../assets/Images'
const User = ({data}) => {
    const [img,setImg]=useState()
    console.log(data,'usernew');

    useEffect(()=>{
        getImg()
    },[data])

    const getImg=async()=>{
        const imagee= images.find((item)=>{
            return item.id===data.code
    
          })
          console.log(imagee,'f');
          setImg(imagee.img)
    }
  return (
    
<div class="main">
    
{/* <!-- <img src="./assets/1.jpg" alt=""> --> */}
<div class="container">
    <div class="main-wrapper">

        <div class="img-section">
    {/* <div data-aos="fade-up"> */}


         <div class="img">
            <img src={img&&img} class="img1" alt=""/>
            <p class="name">{data.name} <br/> <span>{data.code}</span></p>

         </div>
         <div class="details">
            <p class="info">Email: <span>{data.email}</span></p>
            <p class="info">Phone: <span>{data.phone}</span></p>
            <p class="info">Place: <span>{data.place}</span></p>
            <p class="info">District: <span>{data.district}</span></p>
            <p class="info">Date of Birth: <span>{data.dob}</span></p>
            <p class="info institution">institution: <span>{data.institution}</span></p>
         </div>
        </div>
        
        <div class="info-section">
        {/* <div data-aos="fade-down"> */}

            <img src={img1} alt=""/>
            {/* </div> */}

            <div class="ravi"> 
                {/* <!-- <span>7</span> --> */}
                <div data-aos="fade-right ">
<p>
{data.ravi}

             </p>

            </div>
            </div>

            <div class="ravi surah"> 
                {/* <!-- <span>7</span> --> */}
                {/* <div data-aos="fade-right"> */}
                    <p>

{data.subject}

</p>
                    


            {/* </div> */}
            </div>
          
            {/* <div class="btn-section">
                <button class="btn2">Candidates</button>
                <button class="btn1">Log Out</button>
            </div> */}

        </div>
        <div class="bottom">

        </div>

    </div>
</div>
</div>
  )
}

export default User