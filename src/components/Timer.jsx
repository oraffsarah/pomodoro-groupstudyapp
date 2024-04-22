import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import image1 from "../image/train.jpg";
import image2 from "../image/wideLake.jpg";
import image3 from "../image/wideLake2.jpg";
import image4 from "../image/river.jpg";
import image5 from "../image/297.jpg";
import image6 from "../image/dock.jpg";


const backGrounds = [image1, image2, image3, image4, image5, image6];

function Timer() {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [time, setTime] = useState(0);
  const [timerOn, setTimeOn] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const millisecs = (minutes * 60000) + (seconds * 1000);
    setTime(millisecs);
  }, [minutes, seconds]);

  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  const changeBackground = () => {
    setCurrentBackground((prevBackground) => (prevBackground + 1) % backGrounds.length);
  };

  const handleMinuteChange = (e) => {
    setMinutes(parseInt(e.target.value, 10) || 0);
  };

  const handleSecondsChange = (e) => {
    setSeconds(parseInt(e.target.value, 10) || 0);
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${backGrounds[currentBackground]})` }}>
      <div className="content">
        <h1 className="h1">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
        </h1>
        <div
          className='hoverArea'
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering && !timerOn && (
            <>
              <button className="btn btn-primary" onClick={changeBackground}>Change Theme</button>
              <button className="btn btn-primary me-5" onClick={() => setTimeOn(true)}>Start</button>
              <button className="btn btn-primary" onClick={() => setTime(0)}>Reset</button>
              <input type="number" className="form-control" onChange={handleMinuteChange} placeholder='Minutes' />
              <input type="number" className="form-control" onChange={handleSecondsChange} placeholder='Seconds' />
            </>
          )}
          {isHovering && timerOn && (
            <button className="btn btn-primary" onClick={() => setTimeOn(false)}>Stop</button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Timer;