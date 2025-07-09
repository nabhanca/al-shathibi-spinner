import React, { useContext, useState } from 'react';
import './navbar.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { CandidateContextProvider } from '../../Context/CandidatesContext';
import Cookies from 'js-cookie';
import img1 from '../../assets/images/7.webp'


const Navbar = () => {
  const { isBox, setIsBox } = useContext(CandidateContextProvider);
  const [inputValue, setInputValue] = useState('');
  const [inputValue1, setInputValue1] = useState('');

  const navigate=useNavigate()

  const handleSpin=()=>{
  navigate('/')
  }
  return (
    <div className='n'>
      <div className='navbar'>
        {/* <img src={img1} alt="" onClick={()=>navigate('/')}/> */}
        <span onClick={() => setIsBox(!isBox)}>
          <FaArrowLeft />
        </span>
        {/* <p className='text-white ml-8' onClick={handleSpin()}>
          <FaArrowLeft />

        </p> */}

          <button className='text-white !ml-8' onClick={() => navigate('/')}>
                  <FaArrowLeft />
                </button>
      </div>
      {isBox && (
        <div className={isBox ? 'optionBox show' : 'optionBox'}>
          <ul>
            <li>
              <Link to='/video'>video</Link>
            </li><li>
              <Link to='/admin'>admin</Link>
            </li>
            <li  onClick={handleSpin}>
              {/* <Link>spin</Link> */}
              spin
            </li>
            <li>
              <Link  onClick={()=> Cookies.remove('user')}>Logout</Link>
            </li>
            <li className='input-list'>
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Link to={`/img/${inputValue}`}>user</Link>
            </li>
            <li className='input-list'>
              <input
                type='text'
                value={inputValue1}
                onChange={(e) => setInputValue1(e.target.value)}
              />
              <Link to={`/toss/${inputValue1}`}>Toss</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
