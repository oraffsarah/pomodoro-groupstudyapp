// import './App.css';
import React, {useEffect, useState} from 'react';
import image1 from "../../image/train.jpg"
import image2 from "../../image/wideLake.jpg"
import image3 from "../../image/wideLake2.jpg"
import image4 from "../../image/river.jpg"
import image5 from "../../image/297.jpg"
import image6 from "../../image/dock.jpg"
import GoogleButton from 'react-google-button';
import { Button } from 'bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const backGrounds = [image1,image2,image3,image4,image5,image6];



function Homepage() {

  
  const [currentBackground,setCurrentBackground] = useState(0);
  const [time,setTime] = useState(0);
  const [timerOn,setTimeOn] = useState(false); 
  const [minutes,setMinutes] = useState(0);
  const [seconds,setSeconds] = useState(0);
  const [isHovering,setIsHovering] = useState(false);
  



  function changeBackground(){

    //using this function to cycle through the differant backgrounds
    const nextBackgroundIndex = (currentBackground + 1) % backGrounds.length;
    setCurrentBackground(nextBackgroundIndex);
      }

      function handleMinuteChange(e){
        setMinutes(parseInt(e.target.value,10)||0);
      
      }

      function handleSecondsChange(e){
        setSeconds(parseInt(e.target.value,10)||0); 
        
      }

      
      


      useEffect(function updateTimer() {

        const millisecs = (minutes * 60000) + (seconds * 1000);
        setTime(millisecs);
      }, [minutes,seconds])



  

  useEffect(() =>{

    // timer
    let interval = null;

    if(timerOn){
        interval = setInterval(() => {
          setTime(prevTime => prevTime - 10)
        },10)
    }
    else{
        clearInterval(interval)
    }

    return () => clearInterval(interval)
  },[timerOn])
  

  return (

    <><section className="hero" style={{ backgroundImage: `url(${backGrounds[currentBackground]})` }}>
        <div className="content">
          
          <h1 class="h1">
            <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
          </h1>
          <div className='hoverArea' onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            {/* <h1>
    <span>{("0" + Math.floor((time /60000 ) % 60)).slice(-2)}:</span>
    <span>{("0" + Math.floor((time /1000 ) % 60)).slice(-2)}</span>
   </h1> */}
            <div className='themeDiv'>
              {timerOn === false && <button className="btn btn-primary" onClick={changeBackground}>Change Theme</button>}
            </div>


           

            <div className='mb-3'>
              {isHovering && timerOn === false && <button className="btn btn-primary me-5" onClick={() => setTimeOn(true)}>Start</button>}

              {isHovering && timerOn && <button className="btn btn-primary" onClick={() => setTimeOn(false)}>Stop</button>}

              {isHovering && timerOn === false && <button className="btn btn-primary" onClick={() => setTime(0)}>Reset</button>}
            </div>


            <div className='mb-3'> 
              {isHovering && timerOn === false && <input type="number" class="form-control" onChange={handleMinuteChange} placeholder='Minutes'></input>}
            </div>
             
             <div className='mb-3'>
             {isHovering && timerOn === false && <input type="number" class="form-control" onChange={handleSecondsChange} placeholder='Seconds'></input>}
             </div>
              
           
          </div>
        </div>
      </section></>
  );

  
  
}

export default Homepage;