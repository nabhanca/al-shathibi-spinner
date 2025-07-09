import React, { useEffect, useState } from 'react'
import bg from '../assets/images/bg.png'
import BoxList from '../components/Boxlist'
import { useLocation, useParams } from 'react-router-dom';
import { CANDIDATES, QRAVI, QULOOM } from '../utility/Constants';
import { collection, query, where, getDocs,doc,updateDoc } from "firebase/firestore";
import { db } from '../Firebase Folder/FirebaseConfig';
import { FaLock } from "react-icons/fa";
import Loader from '../components/loder/Loader';
import QuestionBox from '../components/QuestionBox';


function Question() {
    const choices = Array.from({ length: 20 }, (_, i) => i + 1); // Example data
    const location = useLocation()
    const { ravi, raviCode } = location.state || {}
    const { code } = useParams()

    const [raviQuestion, setRaviQuestion] = useState()
    const [uloomQuestion, setUloomQuestion] = useState()
    const [currentQuestion, setCurrentQuestion] = useState()
    const [isQuestion, setIsQuestion] = useState(false)

    async function fetchByRaviId() {
        try {
            const q = query(
                collection(db, QRAVI),
                where("raviId", "==", raviCode)
            );

            const snap = await getDocs(q);
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
            console.error("fetchByRaviId error:", err);
            return [];
        }
    }

    const fetchUloomQuestions = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, QULOOM));
            const questions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("All candidates:", questions);
            return questions;
        } catch (error) {
            console.error("Error fetching candidates:", error);
            return [];
        }
    };

    const updateRaviQuestions = async (id) => {
        try {
            const ref = doc(db, QRAVI, id); // Replace "CANDIDATES" with your collection name
            await updateDoc(ref, { isOpen: true }); // e.g., { score: 95 }
            fetchByRaviId()
            console.log("Field added successfully ✔️");
        } catch (error) {
            console.error("Error adding field:", error);
        }
    }

       const updateUloomQuestions = async (id) => {
        try {
            const ref = doc(db, QULOOM, id); // Replace "CANDIDATES" with your collection name
            await updateDoc(ref, { isOpen: true }); // e.g., { score: 95 }
            fetchUloomQuestions()

            console.log("Field added successfully ✔️");
        } catch (error) {
            console.error("Error adding field:", error);
        }
    }
    const addDataToCandidate=async(data)=>{
      try {
    // 1️⃣ build the query
    const q = query(
      collection(db, CANDIDATES),
      where("code", "==", code)      // or "code" if that’s your field
    );

    // 2️⃣ run it
    const snap = await getDocs(q);

    if (snap.empty) {
      console.warn("No candidate with that stcode");
      return;                                // nothing to update
    }

    // 3️⃣ update the first (and ideally only) match
    const ref = snap.docs[0].ref;
    await updateDoc(ref, data);         // merges, doesn’t overwrite
    console.log("Candidate updated ✔️");
  } catch (err) {
    console.error("updateCandidateByStCode error:", err);
  }
    }
    const handleRaviQuestion = (item) => {
        updateRaviQuestions(item.id)
        addDataToCandidate({raviQuestionId:item.id})
        setCurrentQuestion(item)
        setIsQuestion(true)
    }

    const handleUloomQuestion = (item) => {
        updateUloomQuestions(item.id)
        addDataToCandidate({UloomQuestionId:item.id})

        setCurrentQuestion(item)
        setIsQuestion(true)
    }
    useEffect(() => {
        // flag prevents setState after unmount
        let isMounted = true;

        async function loadQuestions() {
            try {
                // run both requests in parallel
                const [quloom, qravi] = await Promise.all([
                    fetchUloomQuestions(),
                    fetchByRaviId()          // pass args if needed
                ]);

                if (isMounted) {
                    setUloomQuestion(quloom);
                    setRaviQuestion(qravi);
                    console.log(qravi, quloom, "all questions");
                }
            } catch (err) {
                console.error("loadQuestions failed:", err);
            }
        }

        loadQuestions();

        // clean‑up (runs on unmount)
        return () => {
            isMounted = false;
        };
    }, [isQuestion]);

    console.log(ravi, raviCode, code, 'qustion page');

    return (
        <div>
            {isQuestion && <QuestionBox setIsQuestion={setIsQuestion} data={currentQuestion} />}
            {raviQuestion ?
                <div className="bg-[#e9e5df] h-screen  !overflow-hidden relative "  >
                    <img src={bg} className="absolute inset-0  z-1 opacity-50" alt="" />
                    <div className="relative items-stretch z-10 flex justify-center  h-full gap-4 p-20">
                        <div className="bg-[#fef6ea] p-4 flex flex-col items-center  justify-center w-1/4 rounded-4xl shadow-[0_5px_15px_rgba(0,0,0,0.35)]">

                            <h2 className='font-bold py-2 pb-4'>الرواة</h2>


                            <div className="flex flex-wrap items-center justify-center  gap-x-8 gap-y-4">

                                {raviQuestion.map((item, index) => {
                                    return (
                                        <>
                                            {!item.isOpen ?
                                                <div data-aos="fade-up">
                                                    <div onClick={() => handleRaviQuestion(item)} className="bg-[#b19e86] w-25 h-25 text-center  rounded-3xl flex items-center justify-center text-3xl shadow-4xl font-bold text-[#fef7eb] border-6 border-[#f2e3ca] hover:scale-105 transition-transform duration-300" key={index} >{index + 1}</div>

                                                </div> :
                                                <div data-aos="fade-up">
                                                    <div className="bg-[#b19e86] w-25 h-25 text-center rounded-3xl flex items-center justify-center text-3xl shadow-4xl font-bold text-[#fef7eb] border-6 border-[#f2e3ca] hover:scale-105 transition-transform duration-300"><FaLock /></div>
                                                </div>
                                            }

                                        </>
                                    )
                                })}

                            </div>
                        </div>

                        <BoxList items={uloomQuestion} handleUloomQuestion={handleUloomQuestion} />
                    </div>
                </div> :
                <>
                    <Loader />
                </>}
        </div>
    )
}

export default Question
