

import React, { useState, useEffect, useContext } from "react";
import { SpinWheel } from "react-spin-wheel";
import "react-spin-wheel/dist/index.css";
import { useNavigate } from "react-router-dom";
import "./spinner.css";
import Popup from "../popup/Popup";
import { CandidateContextProvider } from "../../Context/CandidatesContext";
import Loader from "../loder/Loader";
import bg from '../../assets/images/bg.png'


const Spinner = ({ spinData }) => {
  const [result, setResult] = useState("");
  const { sorted, isPopup, setIsPopup,allCandidates } = useContext(CandidateContextProvider);

  const handleSpinResult = (code, id,name,institution) => {

    
    console.log("fd", name);

    const data = {
      st: code,
      id: id,
      name:name,
      institution:institution,
    };
    if (code !== "AL-SHATHIBI") {
      console.log("hd");

      setResult(data);
      setTimeout(() => setIsPopup(true), 1000);
    }
  };
  return (
    <>
<div className="bg-[#e9e5df] h-screen !overflow-hidden relative "  >
            {/* <div className="absolute inset-0  z-1 opacity-50 " style={{ backgroundImage: `url(${bg})` }}></div>  */}
            <img src={bg} className="absolute inset-0  z-1 opacity-50" alt="" />      
             {isPopup && (
          <Popup spinData={result} isSpinData setIsPopup={setIsPopup} />
        )}

        {/* {spinData &&    */}
<div data-aos="zoom-in" className="relative z-10">
          <div className="">
            <SpinWheel
              items={[...spinData]}
              itemColors={["#7b664c", "#d4c9ba",'#aa987e']}
              size={550}
              resetActionName={"spin"}
              spinWheelStyle={{border:'none',backgroundColor:'#eae5de' ,  }}
              spinContainerStyle={{boxShadow:'none',}}
              spinItemStyle={{fontSize:'20px',fontWeight:'500',writingMode:"vertical-rl", textOrientation:'sideways',}}
              spinButtonStyle={{color:'#7b664c',width:'80px',boxShadow:'none', height:'80px', border:'none'}}

              resetButtonStyle={{color:'#7b664c',width:'80px',boxShadow:'none', height:'80px', border:'none'}}
              onFinishSpin={(item) => {
                handleSpinResult(item.name, item.id,item.realName,item.institution);
              }}
            />
        
          </div>
          </div>
       
        {/* } */}
      </div>
    </>
  );
};

export default Spinner;
