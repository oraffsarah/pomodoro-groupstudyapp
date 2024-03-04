
import './App.css';
import React, {useEffect, useState} from 'react';
import image1 from "./image/pic2.jpg"
import image2 from "./image/picWide.jpg"

const backGrounds = [image1,image2];



function App() {
  const [currentBackground,setCurrentBackground] = useState(0);
  const [time,setTime] = useState(1500000);
  const [timerOn,setTimeOn] = useState(false); 
  const [userNumber,setUserNumber] = useState(' ');

  useEffect(() =>{
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
  

  function changeBackground(){

const nextBackgroundIndex = (currentBackground + 1) % backGrounds.length;
setCurrentBackground(nextBackgroundIndex);
   
  }

  

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
        </div>
      </div>
    </section>
  );
  
}

export default App;




