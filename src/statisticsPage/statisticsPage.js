import React, { useEffect, useState, useCallback } from 'react';
import './StatisticsPage.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, query, collection, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // 引入身份验证相关函数
import 'bootstrap/dist/css/bootstrap.min.css'; // 确保导入了Bootstrap的CSS

const firebaseConfig = {
    apiKey: "AIzaSyCNv4KHIXBNa5Cbw0s1_EpU2IsH2RsThPw",
    authDomain: "react-chat-11602.firebaseapp.com",
    databaseURL: "https://react-chat-11602-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "react-chat-11602",
    storageBucket: "react-chat-11602.appspot.com",
    messagingSenderId: "219582341541",
    appId: "1:219582341541:web:24f5da00e7aefaf0d3084c"
};

// 初始化 Firebase 应用
initializeApp(firebaseConfig);
const db = getFirestore();

function StatisticPage() {
    const [todayHours, setTodayHours] = useState('');
    const [rankings, setRankings] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [isToggleActive, setIsToggleActive] = useState(false);

    // 获取今天的日期
    function getTodayDate() {
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
        const localTimestamp = now.getTime() - timezoneOffset;
        const localDate = new Date(localTimestamp).toISOString().slice(0, 10);
        return localDate;
    }

    // 提交数据到 Firebase
    async function submitData() {
        const hoursInput = document.getElementById('hours');
        const minutesInput = document.getElementById('minutes');
        const secondsInput = document.getElementById('seconds');

        const hours = parseInt(hoursInput.value, 10);
        const minutes = parseInt(minutesInput.value, 10) || 0;
        const seconds = parseInt(secondsInput.value, 10) || 0;

        // Convert total time to hours as a decimal
        const totalHours = hours + (minutes / 60) + (seconds / 3600);

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
    
            // Clear input and refetch data
            hoursInput.value = '';
            minutesInput.value = '';
            secondsInput.value = '';
            fetchTodayHours();
            fetchRankings();
        }
    }

    // 从 Firebase 获取今天的学习时长
    const fetchTodayHours = useCallback(async () => {
        const todayDate = getTodayDate(); // 获取当前日期
        const docId = `${userId}_${todayDate}`;
        const docRef = doc(db, 'studyData', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setTodayHours(docSnap.data().hours);
        } else {
            setTodayHours('No study data for today.');
        }
    }, [userId, db]);

    // 从 Firebase 获取排名
    const fetchRankings = useCallback(async () => {
        const todayDate = getTodayDate();
        const rankingQuery = query(
            collection(db, 'studyData'),
            where('date', '==', todayDate),
            orderBy('hours', 'desc')
        );
    
        const querySnapshot = await getDocs(rankingQuery);
        const rankingDataPromises = querySnapshot.docs.map(async (docSnapshot) => {
            const userData = docSnapshot.data();
            const userRef = doc(db, 'users', userData.userId);
            const userDoc = await getDoc(userRef);
            
            // 检查用户是否选择隐藏他们的排名
            if (userDoc.exists() && userDoc.data().hideFromRankings) {
                return null; // 用户选择隐藏排名时，返回null
            }
            
            return {
                ...userData,
                id: docSnapshot.id,
                username: userDoc.exists() ? userDoc.data().username : "Anonymous",
                avatarUrl: userDoc.exists() ? userDoc.data().avatarUrl : './logo512.png'
            };
        });
    
        const rankingData = (await Promise.all(rankingDataPromises)).filter(Boolean); // 移除所有null项
        setRankings(rankingData);
    }, [db]);
    
    
    
    
    // 处理滑动开关的函数
    const toggleSwitch = async () => {
        const newIsToggleActive = !isToggleActive;
        setIsToggleActive(newIsToggleActive); // 改变状态

        // 更新数据库中的用户设置
        if (userId) { // 确保 userId 不是 null 或 undefined
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, { hideFromRankings: newIsToggleActive }, { merge: true });
        }

        // 立即重新获取排名
        fetchRankings();
    };

    // 滑动开关的JSX
    // ToggleSwitch 组件
    const ToggleSwitch = () => (
        <div className="form-check form-switch" onClick={toggleSwitch}>
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="customSwitch1"
                checked={isToggleActive}
                onChange={toggleSwitch}
                disabled={userId ? false : true}  // 确保用户登录后才能使用开关
            />
            <label className="form-check-label" htmlFor="customSwitch1">
                {isToggleActive ? 'You have exited the ranking' : 'Click to exit ranking'}
            </label>
        </div>
    );

// 使用该组件
<ToggleSwitch />


    // 初始加载时获取今天的学习时长
    useEffect(() => {
        fetchTodayHours();
        fetchRankings(); // 页面加载时自动获取排名
    }, [fetchTodayHours, fetchRankings]);

    // 处理 Google 登录
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
        const updateUserProfile = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (user) {
                await user.reload(); // 强制重新加载用户的最新信息
                console.log('Updated User Name:', user.displayName); // 打印最新的用户名
                setUserAvatar(user.photoURL); // 更新头像
            }
        };
    
        updateUserProfile();
    }, []);
    
    function calculateStreak(dates) {
        if (!dates || dates.length === 0) return 0;
    
        let streak = 0;
        let currentDate = new Date();
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
        while (dates.includes(currentDate.toISOString().slice(0, 10))) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
    
        return streak;
    }
    
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        async function fetchStreak() {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const studyDates = userSnap.data().studyDates || [];
                setStreak(calculateStreak(studyDates));
            }
        }

        if (userId) {
            fetchStreak();
        }
    }, [userId, db]);



    return (
        <div className="container mt-5">
            <h3 className="mb-4">{getTodayDate()}</h3>
            <h1 className="mb-4">Study Time Statistics</h1>
            <div className="mb-3">
            <input type="number" id="hours" className="form-control d-inline-block w-auto mr-2" placeholder="Enter study hours" />
                <input type="number" id="minutes" className="form-control d-inline-block w-auto mr-2" placeholder="Enter study minutes" />
                <input type="number" id="seconds" className="form-control d-inline-block w-auto mr-2" placeholder="Enter study seconds" />
                <button onClick={submitData} className="btn btn-primary">Submit</button>
            </div>
            <div id="dataDisplay" className="mb-3">
                {todayHours ? `Today you have studied ${todayHours} hours.` : 'Loading data...'}
            </div>
            <div className="streak-display">
                <h4>
                You have studied for {streak + 1} {streak + 1 === 1 ? 'consecutive day! 🔥' : 'consecutive days! 🔥'}
                </h4>
            </div>
            <div id="rankingDisplay">
                <div className="rankingTitle">
                    <h2 >Today's Rankings</h2>
                    <b><ToggleSwitch /> </b>{/* 放置你希望出现滑动开关的位置 */}
                </div>
                {rankings.length > 0 ? (
                    <ol>
                        {rankings.map((user, index) => (
                            <li key={user.id} className="ranking-item"> {/* 应用新的样式类 */}
                                <div>
                                    <span>{index + 1}. </span> {/* 显示排名 */}
                                    <img src={user.avatarUrl || './logo512.png'} alt="User Avatar" className="rounded-circle" />
                                    <span>{user.username}</span> {/* 显示用户的用户名 */}
                                </div>
                                <span>{user.hours} hours</span> {/* 学习时长显示在最右边 */}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p>No study data for today.</p>
                )}
            </div>
    </div>
    );
}

export default StatisticPage;
