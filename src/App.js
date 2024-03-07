
import './App.css';
import React, {useEffect, useState} from 'react';
import image1 from "./image/pic2.jpg"
import image2 from "./image/picWide.jpg"
import image3 from "./image/pic3.jpg"
import image4 from "./image/pic4.jpg"


const backGrounds = [image1,image2,image3,image4];



function App() {
  const [currentBackground,setCurrentBackground] = useState(0);
  const [time,setTime] = useState(0);
  const [timerOn,setTimeOn] = useState(false); 
  const [minutes,setMinutes] = useState(0);
  const [seconds,setSeconds] = useState(0);


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
    <section className="hero" style={{backgroundImage: `url(${backGrounds[currentBackground]})`}}>
      <div className="content">
        <h1>
        <span>{("0" + Math.floor((time /60000 ) % 60)).slice(-2)}:</span>
        <span>{("0" + Math.floor((time /1000 ) % 60)).slice(-2)}</span>

        </h1>
        <p></p>
        <a href="#start">Start</a>
        
        <button onClick={changeBackground}>Change Theme</button>

       

        <div>
          <button onClick={() => setTimeOn(true)}>Start</button>
          <button onClick={() => setTimeOn(false)}>Stop</button>
          <button onClick={() => setTimeOn(true)}>Resume</button>
          <button onClick={() => setTime(0)}>Reset</button>
          <input type="number" onChange={handleMinuteChange} placeholder='Minutes' ></input>
          <input type="number" onChange={handleSecondsChange} placeholder='Seconds'  ></input>
          <h1>{time}</h1>
        </div>
      </div>
    </section>
  );
  
}

export default App;




