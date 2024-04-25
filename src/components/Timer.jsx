import React, { useEffect, useState } from 'react';
import { getFirestore, doc, setDoc, getDoc, query, collection, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import image1 from "../image/train.jpg";
import image2 from "../image/wideLake.jpg";
import image3 from "../image/wideLake2.jpg";
import image4 from "../image/river.jpg";
import image5 from "../image/297.jpg";
import image6 from "../image/dock.jpg";


const backGrounds = [ image1, image2, image3, image4, image5, image6];

const db = getFirestore();




function Timer() {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [time, setTime] = useState(0);
  const [timerOn, setTimeOn] = useState(false);
  const [sum, setSum] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isHovering, setIsHovering] = useState(true); //false

  const [todayHours, setTodayHours] = useState('');
  const [rankings, setRankings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [isToggleActive, setIsToggleActive] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 用户已登录
        setUserId(user.uid); // 将用户的 UID 设置为 userId
        setUserAvatar(user.photoURL); // 设置用户头像 URL

        // 获取用户数据
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          // 读取用户是否隐藏排名的设置
          const hideFromRankings = userSnap.data().hideFromRankings || false;
          setIsToggleActive(hideFromRankings); // 设置隐藏排名的状态

          // 存储用户信息
          await setDoc(userRef, {
            userId: user.uid,
            avatarUrl: user.photoURL,
            username: user.displayName,
            email: user.email,
            hideFromRankings // 确保持久化
          }, { merge: true });
        }
      } else {
        // 用户未登录
        setUserId(null);
        setUserAvatar(null);
        setIsToggleActive(false); // 重置隐藏排名状态
      }
    });

    return () => unsubscribe();
  }, [db]);


  useEffect(() => {
    const millisecs = (minutes * 60000) + (seconds * 1000);
    setTime(millisecs);
  }, [minutes, seconds]);

  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
          setTime(prevTime => {
              if (prevTime <= 0) { // Check if time has reached zero or below
                  clearInterval(interval); // Stop the interval
                  setTimeOn(false); // Stop the timer
                  return 0; // Set time explicitly to zero
              }
              return prevTime - 10;
          });
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  function getTodayDate() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
    const localTimestamp = now.getTime() - timezoneOffset;
    const localDate = new Date(localTimestamp).toISOString().slice(0, 10);
    return localDate;
  }

  async function updateTime(minutes, seconds) {
    // Convert total time to hours as a decimal
    const totalHours = (minutes / 60) + (seconds / 3600);

    if (!isNaN(totalHours) && totalHours > 0) {
      const todayDate = getTodayDate();
      const docId = `${userId}_${todayDate}`;
      const docData = {
        userId: userId,
        hours: totalHours.toFixed(2),
        date: todayDate
      };

      await setDoc(doc(db, 'studyData', docId), docData);

      // Update study dates array
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userDates = userSnap.data().studyDates || [];
        if (!userDates.includes(todayDate)) {
          await setDoc(userRef, {
            studyDates: [...userDates, todayDate]
          }, { merge: true });
        }
      }
    }
  }

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
      
        <h1 className="display-4 mb-3">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
        </h1>
        <div
          className='hoverArea'
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(true)} //false
        >
          {isHovering && !timerOn && (
            <>
              
              <button className="btn btn-primary me-5 mb-3" onClick={() => setTimeOn(true)}>Start</button>
              <button className="btn btn-primary mb-3" onClick={() => setTime(0)}>Reset</button>
              <input type="number" className="form-control mb-3" onChange={handleMinuteChange} placeholder='Minutes' />
              <input type="number" className="form-control mb-3" onChange={handleSecondsChange} placeholder='Seconds' />
              <button className="btn btn-success btn-lg mb-3" onClick={changeBackground}>Change Theme</button>
            </>
          )}
          {isHovering && timerOn && (
            <button className="btn btn-primary" onClick={() => {
              setTimeOn(false);
              //             updateTime(hours, minutes, seconds);
            }}>Stop</button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Timer;