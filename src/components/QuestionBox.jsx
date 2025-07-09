import React, { useState } from "react";
import bg from "../assets/images/bg.png";
import { IoMdClose } from "react-icons/io";

const QuestionBox = ({ data, setIsQuestion }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Background image */}
      <img
        src={bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30  z-20"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#fef6ea] bg-opacity-50 z-10" />

      {/* Close button */}
      <button
        onClick={() => {
          console.log("Close clicked");
          setIsQuestion(false);
        }}
        className="absolute top-6 left-6 z-50 text-[#352e24] text-3xl p-2 hover:text-[#5a4a32] transition"
      >
        <IoMdClose />
      </button>

      {/* Content card */}
      <div className="relative z-20 w-full h-full flex -mt-20 items-center justify-center">
        <div className="w-[90%] max-w-xl bg-[#fef6ea] rounded-4xl p-10 shadow-2xl text-center flex flex-col items-center justify-center">
          <p className="text-xl font-semibold pb-4">
            {!showAnswer ? 'data?.question' || "No Question" : 'data?.answer' || "No Answer"}
          </p>

          {/* {!showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className="mt-4 bg-[#634e2f] text-white px-6 py-2 rounded-3xl font-semibold hover:bg-[#f8e4c6] hover:text-black transition"
            >
              Show Answer
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default QuestionBox;
