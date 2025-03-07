import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import Loader from './components/Loader';
import { checkAuth } from './http/user'; 
import { useContext } from 'react';
import { Context } from './index';

const App = () => {
  const { user } = useContext(Context);  
  const [showNavBar, setShowNavBar] = useState(false); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await checkAuth(); 
        if (userData) {
          user.setUser(userData);  
          user.setIsAuth(true);  
          setShowNavBar(true);  
        } else {
          user.setUser(null);  
          user.setIsAuth(false);  
          setShowNavBar(false);  
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
      } finally {
        setLoading(false);  
      }
    };
  
    checkUser(); 
  }, [user]);
  

  if (loading) {
    return <Loader />; 
  }

  return (
    <BrowserRouter>
      <Loader setShowNavBar={setShowNavBar} />
      {showNavBar && <NavBar user={user} />} 
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
