import React, { useContext,useEffect,useState } from 'react'
import Spinner from '../components/spinner/Spinner'
import {db} from '../Firebase Folder/FirebaseConfig'
import Loader from '../components/loder/Loader'

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { CandidateContextProvider } from '../Context/CandidatesContext';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const [result, setResult] = useState("");
  const [isdata, seIstData] = useState(false);
  const [sorted,setSorted]=useState([])

  const [spinData, setSpinData] = useState([]);
  // const [isPopup,setIsPopup]=useState(false)
  // const navigate = useNavigate();
  const {  isPopup, setIsPopup,allCandidates ,loader,setLoader} = useContext(CandidateContextProvider);
  // const location=useLocation()

  // const data=location.state
  // if(data){
  //   window.location.reload();

  // }
  //  console.log("sorted", sorted);
  useEffect(() => {
    // if (sorted.length > 1) {
      addSpinData();
   
      // seIstData(false)
    
  }, [sorted]);
  useEffect(()=>{
    if(allCandidates){

    
    getSort()
    }
  },[allCandidates])

  const getSort=()=>{
      
    allCandidates.map((item)=>{

     if(!item.isRecited){
      
      setSorted(sorted=> [...sorted,item])
     }
    })
    

    
    

  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {

        // Generate random number 
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

  const addSpinData = () => {
    const division = sorted.length % 2 == 0;
  //  const shuffledArray= shuffleArray(sorted)
    // if (sorted.length % 2 == 0) {
      sorted.map((candidate, index) =>
        setSpinData((spinData) => [
          ...spinData,
          { name: candidate.code, realName:candidate.name,institution:candidate.institution, id: candidate.id, key: `${index}` },
        ])
      );
      seIstData(true);
    // } 
    // else {
    //   // setSpinData((spinData) => [
    //   //   ...spinData,
    //   //   { name: "al-shathibi", id: false },
    //   // ]);
    //   shuffledArray.map((candidate, index) =>
    //     setSpinData((spinData) => [
    //       ...spinData,
    //       { name: candidate.code,realName:candidate.name, institution:candidate.institution,id: candidate.id },
    //     ])
    //   );
    //   seIstData(true);
    // }
  };

   
  
  
  // const {allCandidates,setAllCandidates,isPopup}=useContext(CandidateContextProvider)








console.log('sd',allCandidates);



  // const addCandidate=async()=>{
    
  //   try {
  //     const docRef = await addDoc(usersCollectionRef, {
  //   //  ...candidates[30]
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  
  // }

  return (

    <div >
    
 
    {loader?
   
    <>
        <Spinner spinData={spinData} isdata={isdata} />
    </>:
    <>
    <Loader/>
    </>
}
    
    

  

    </div>
    
  )
}

export default HomePage