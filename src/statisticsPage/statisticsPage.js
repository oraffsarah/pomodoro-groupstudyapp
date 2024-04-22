import React, { useEffect, useState, useCallback } from 'react';
import './statisticsPage.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, query, collection, where, orderBy, getDocs, addDoc  } from 'firebase/firestore';
import { auth, provider, database } from '../Firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // 引入身份验证相关函数

// Firebase 配置
/*
const firebaseConfig = {
    apiKey: "AIzaSyCNv4KHIXBNa5Cbw0s1_EpU2IsH2RsThPw",
    authDomain: "react-chat-11602.firebaseapp.com",
    databaseURL: "https://react-chat-11602-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "react-chat-11602",
    storageBucket: "react-chat-11602.appspot.com",
    messagingSenderId: "219582341541",
    appId: "1:219582341541:web:24f5da00e7aefaf0d3084c"
};
*/
// 初始化 Firebase 应用
//initializeApp(firebaseConfig);
//const db = getFirestore();
const db = 0;
function StatisticPage() {
    const [todayHours, setTodayHours] = useState('');
    const [periodHours, setPeriodHours] = useState(null);
    const [periodText, setPeriodText] = useState('');
    const [rankings, setRankings] = useState([]);
    const [userId, setUserId] = useState(null); // 使用状态来存储用户 ID
    const [userAvatar, setUserAvatar] = useState(null); 

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
        const hours = parseInt(hoursInput.value, 10); // 解析为整数

        if (hours) {
            const todayDate = getTodayDate(); // 获取当前日期
            const docId = `${userId}_${todayDate}`; // 生成文档名称
            const docData = {
                userId: userId,
                hours: hours,
                date: todayDate
            };

            // 使用 setDoc 方法创建新的文档或更新现有文档
            await setDoc(doc(db, 'studyData', docId), docData);

            hoursInput.value = ''; // 清空输入
            fetchTodayHours(); // 重新获取今天的学习时长
            fetchRankings(); // 更新排名
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
    
            return {
                ...userData,
                id: docSnapshot.id,
                username: userDoc.exists() ? userDoc.data().username : "Anonymous", // 获取用户名
                avatarUrl: userDoc.exists() ? userDoc.data().avatarUrl : './logo512.png' // 使用用户自己的头像，如果没有则用默认头像
            };
        });
    
        const rankingData = await Promise.all(rankingDataPromises);
        setRankings(rankingData);
    }, [db]);
    
    
    
    

    // 获取指定周期内的学习时长，并累加
    const fetchPeriodHours = async (period) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - period); // 从今天开始往前推 period 天

        const formattedStartDate = startDate.toISOString().slice(0, 10);
        const formattedEndDate = endDate.toISOString().slice(0, 10);

        const periodQuery = query(
            collection(db, 'studyData'),
            where('userId', '==', userId),
            where('date', '>=', formattedStartDate),
            where('date', '<=', formattedEndDate),
            orderBy('date', 'asc')
        );

        const querySnapshot = await getDocs(periodQuery);
        let totalHours = 0;
        querySnapshot.forEach(doc => {
            totalHours += doc.data().hours;
        });

        setPeriodHours(totalHours); // 设置指定周期内的总学习时长
        setPeriodText(`You have studied a total of ${totalHours} hours in the past ${period} days.`);
    };

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
                console.log("User Name: ", user.displayName); // 打印用户的显示名称
                console.log("User Email: ", user.email); // 打印用户的邮箱地址
    
                // 检查并更新用户数据
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    userId: user.uid,
                    avatarUrl: user.photoURL,
                    username: user.displayName, // 存储用户名
                    email: user.email // 存储用户邮箱
                }, { merge: true }); // 使用 merge 选项确保不会覆盖其他用户数据
            } else {
                // 用户未登录
                setUserId(null);
                setUserAvatar(null); // 清空用户头像 URL
            }
        });
    
        return () => unsubscribe();
    }, []);
    
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
    
    


    return (
        <div className="container mt-5">
            <h3 className="mb-4">{getTodayDate()}</h3>
            <h1 className="mb-4">Study Time Statistics</h1>
            <div className="mb-3">
                <input type="number" id="hours" className="form-control d-inline-block w-auto mr-2" placeholder="Enter study hours" />
                <button onClick={submitData} className="btn btn-primary">Submit</button>
            </div>
            <div className="mb-3">
                <button onClick={() => fetchPeriodHours(7)} className="btn btn-secondary mr-2">7 Days</button>
                <button onClick={() => fetchPeriodHours(30)} className="btn btn-secondary mr-2">30 Days</button>
            </div>
            <div id="dataDisplay" className="mb-3">
                {todayHours ? `Today you have studied ${todayHours} hours.` : 'Loading data...'}
            </div>
            {periodHours !== null && (
                <div className="mb-3">
                    {periodText}
                </div>
            )}
            <div id="rankingDisplay">
                <h2>Today's Rankings</h2>
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
