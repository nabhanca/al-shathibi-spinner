import React, { useContext, useEffect, useState } from "react";
import img1 from "../assets/images/7.webp";
// import img2 from "../assets/images/9.webp";
import "./toss.css";
import { FaLock } from "react-icons/fa";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import Popup from "../components/popup/Popup";
import { CandidateContextProvider } from "../Context/CandidatesContext";
import Loader from "../components/loder/Loader";
import Selection from "../components/Selection";
import bg from '../assets/images/bg.png'
import v3 from '../assets/img25/v3.png'
import typo from '../assets/img25/typo.webp'
import first from '../assets/img25/first.webp'
import quran from '../assets/img25/quran.png'
import quran1 from '../assets/img25/quran1.png'
import second from '../assets/img25/second.webp'
import third from '../assets/img25/third.webp'
const Toss = () => {
  const [sub, setSub] = useState([]);
  // const [] = useState(false);
  const [is, setIs] = useState(false)
  const navigate = useNavigate()
  const id = useParams();
  const { subs, updateSub, allCandidates, isPopup, sorted, setIsPopup } = useContext(CandidateContextProvider);
  console.log(id.id, allCandidates);
  useEffect(() => {

    checkUser()


  }, [allCandidates])

  const checkUser = async () => {
    setIsPopup(false)
    console.log(allCandidates);
    const user = await allCandidates.find((item) => {
      return item.code == id.id
    })
    console.log('userrrrrrr', user);
    if (user) {

      if (user.subject) {
        navigate(`/img/${id.id}`)

      }
      else {
        setIs(true)

      }


    }


  }

  const handleSub = async(idd, subject) => {
    console.log('dfdadaa');
      const user = await allCandidates.find((item) => {
      return item.code == id.id
    })
    console.log('dfdadaa',user);

    const subData = {
      id: idd,
      sub: subject,
      candidateId: user.id,
      candidateCode:id.id
      
    }


    setSub(subData);
    setIsPopup(true);
  };


  return (
    <div className="toss">
      {is ?
        <>
          {isPopup && <Popup tossData={sub} isToss />}


          <div className="bg-[#e9e5df] h-screen !overflow-hidden relative "  >
                      <div className="absolute inset-0  z-1 opacity-50 " style={{ backgroundImage: `url(${bg})` }}></div>
                      <img src={v3} className='fixed w-[700px] z-8 -left-[450px]  top-1/2 -translate-y-1/2 animate-[spin_35s_linear_infinite]' alt="" />
                      <img src={v3} className='fixed w-[700px] z-8 -right-[450px]  top-1/2 -translate-y-1/2 animate-[spin_35s_linear_infinite]' alt="" />
          
                      <div className="flex gap-8 justify-center items-center mt-5 ">
                          <img src={typo} className='w-80 ' alt="" />
                          <div className="flex gap-6">
                              <img src={second} className='w-25 h-25 object-cover' alt="" />
                              <img src={first} className='w-25 h-25 object-cover scale-115' alt="" />
                              <img src={third} className='w-25 h-25 object-cover' alt="" />
                          </div>
                      </div>
          
                      <div className="relative z-10 flex justify-center mt-8">
                          <div className="bg-[#fef6ea] flex items-center justify-center w-2/3 rounded-4xl shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
                          
                          <img src={quran1} className='w-90' alt="" />
          
                          
                           <div className="flex flex-wrap  gap-10">
                              {subs.map((item, index) => {
                                              return (
                                                <>
                                                  {item.isSelected ?
                                                    <div data-aos="fade-up">
                              <div className="bg-[#b19e86] w-28 h-28 text-center rounded-3xl flex items-center justify-center text-3xl shadow-4xl font-bold text-[#fef7eb] border-6 border-[#f2e3ca] hover:scale-105 transition-transform duration-300" key={index} onClick={() => handleSub(item.id, item.sub)}>{index+1}</div>
                                                    
                                                    </div> :
                                                    <div data-aos="fade-up">
                              <div className="bg-[#b19e86] w-28 h-28 text-center rounded-3xl flex items-center justify-center text-3xl shadow-4xl font-bold text-[#fef7eb] border-6 border-[#f2e3ca] hover:scale-105 transition-transform duration-300"><FaLock/></div>
                                                    </div>
                                                  }
                            
                                                </>
                                              )
                                            })}
                            
                           </div>
                          </div>
                      </div>
                  </div>
        </> :
        <>
          <Loader />
        </>
      }
    </div>
    // <div className="">
    //   <Selection/>
    // </div>
  );
};

export default Toss;
