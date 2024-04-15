import React, { useEffect, useState, useCallback } from 'react';
import './StatisticsPage.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, query, collection, where, orderBy, getDocs, addDoc } from 'firebase/firestore';

// Firebase配置
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
const [periodHours, setPeriodHours] = useState(null);
const [periodText, setPeriodText] = useState('');
const [rankings, setRankings] = useState([]);
const userId = 'user123'; 

// getTodayDate in Ireland timezone(GMT+1)
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
const todayDate = getTodayDate(); // 获取当前日期
const rankingQuery = query(
    collection(db, 'studyData'),
    where('date', '==', todayDate),
    orderBy('hours', 'desc')
);

const querySnapshot = await getDocs(rankingQuery);
let rankingData = [];
querySnapshot.forEach((doc) => {
    rankingData.push({ ...doc.data(), id: doc.id });
});

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
}, [fetchTodayHours]);

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
    <button onClick={fetchRankings} className="btn btn-secondary">Ranking</button>
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
            <li key={user.id} className="mb-2 d-flex justify-content-between align-items-center">
            <div>
                <span>{index + 1}. </span>
                <img src={user.avatarUrl || './logo512.png'} alt="User Avatar" className="rounded-circle mr-2" />
                <span>{user.userId}</span>
            </div>
            <span>{user.hours} hours</span>
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
