import React, { createContext, useState, useEffect } from 'react'
import { db } from '../Firebase Folder/FirebaseConfig'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  deleteDoc,

  doc,
} from "firebase/firestore";
import AOS from "aos";
import "aos/dist/aos.css";
import { CANDIDATES } from '../utility/Constants';
export const CandidateContextProvider = createContext('')

const CandidatesContext = ({ children }) => {
  const [allCandidates, setAllCandidates] = useState([])
  const [subs, setSubs] = useState([])
  const [isBox, setIsBox] = useState(false)
  const [loader, setLoader] = useState(false)
  const [isPopup, setIsPopup] = useState(false)
  const usersCollectionRef = collection(db, CANDIDATES);
  const subjectsRef = collection(db, "subjects");

  useEffect(() => {

    getCandidates()
    getSubjects()


  }, []);
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);


  useEffect(() => {
    if (isPopup) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';

    }

  }, [isPopup])




  const getCandidates = async () => {
    setLoader(false)
    const candidatesSnapshot = await getDocs(usersCollectionRef);
    setAllCandidates(candidatesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setLoader(true)
  }

  const getSubjects = async () => {
    const subjectsSnapshot = await getDocs(subjectsRef);
    setSubs(subjectsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

  }

  const updateCandidate = async (candId,sub) => {
  try {
    console.log(candId,sub,'hi sub');
    

    const docRef = doc(db, CANDIDATES, candId);
    if(sub){
 await updateDoc(docRef, {
      isRecited: true,
      finalroundsurah: sub,
    });
    }else{
       await updateDoc(docRef, {
      isRecited: true,
    });
    }
   

    await Promise.all([getSubjects(), getCandidates()]);
  } catch (err) {
    console.error("Failed to update candidate:", err);
  }
};

  const updateSub = async (surahData) => {
    console.log(surahData, 'q query');

    const HeroRef = doc(db, 'subjects', surahData.id);

    await updateDoc(HeroRef, {
      isSelected: false
    });
    
    updateCandidate(surahData.candidateId,surahData.sub)

  }

  return (
    <CandidateContextProvider.Provider value={{ loader, setLoader, isBox, setIsBox, allCandidates, setAllCandidates, subs, updateSub, updateCandidate,isPopup, setIsPopup }}>
      {children}
    </CandidateContextProvider.Provider>
  )
}

export default CandidatesContext