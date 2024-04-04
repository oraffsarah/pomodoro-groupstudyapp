
import './App.css';
import React, {useEffect, useState} from 'react';
import GoogleButton from 'react-google-button'

import Timer from './components/Timer';
import SignIn from './pages/Signin';
import { Routes ,Route } from 'react-router-dom';
import { AuthContextProvider } from './context/authContext';
import Account from './pages/Account';
import Home from './pages/Home';






function App() {
  

  return (
 

 

<AuthContextProvider>
<Routes> 
  <Route path='/' element={<Home/>}/>
  <Route path='/signin' element={<SignIn/>}/>
  <Route path='account' element={<Account/>}/>
  </Routes>

 <SignIn/>

 </AuthContextProvider>

  );
}
      
 
{/* <Timer></Timer> */}
//  <AuthContextProvider>
//   </NavBar>
//   <Routes> 
//   <Route path='/' element={<Home/>}/>
//   <Route path='/signin' element={<Signin/>}/>
//   <Route path='/account' element={<Account/>}/>
//  </Routes>

//  </AuthContextProvider>
//  <Routes> 
//   <Route path='/' element={<Home/>}/>
//   <Route path='/signin' element={<Signin/>}/>
//   <Route path='/account' element={<Account/>}/>
//  </Routes>
  
  


export default App;




