import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import SplashScreen from './components/Loader';

const App = observer(() => {
  const { user } = useContext(Context);  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [showNavBar, setShowNavBar] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Проверка авторизации...');
        if (user.token) {
          const isAuthenticated = await user.checkAuth();
          console.log('Результат проверки авторизации:', isAuthenticated);
        } else {
          console.log('Токен отсутствует, пользователь не авторизован');
          user.setIsAuth(false);  
        }
      } catch (e) {
        console.error('Ошибка при проверке авторизации:', e);
        setError('Ошибка при проверке авторизации. Попробуйте перезагрузить страницу.');
      } finally {
        setAuthChecked(true);
      }
    };
  
    checkUser(); 
  }, [user]);

  useEffect(() => {
    if (authChecked) {
      const timer = setTimeout(() => {
        setShowNavBar(true);
        setLoading(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [authChecked]);

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Перезагрузить страницу
        </button>
      </div>
    );
  }

  return (
    <>
      {loading && <SplashScreen setShowNavBar={setShowNavBar} />}
      <BrowserRouter style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <NavBar />
      <AppRouter />
    </BrowserRouter>
    </>
  );
});

export default App;
