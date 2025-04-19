import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import Loader from './components/Loader';
import { checkAuth } from './http/user';
import { useContext } from 'react';
import { Context } from './index';
import { observer } from 'mobx-react-lite';

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('App mounted, current auth state:', user.isAuth);
    
    const checkUser = async () => {
      try {
        console.log('Checking auth...');
        const userData = await checkAuth();
        console.log('Auth check result:', userData);
        
        if (userData) {
          user.setUser(userData);
          user.setIsAuth(true);
          console.log('Auth state updated:', user.isAuth);
        } else {
          user.setUser(null);
          user.setIsAuth(false);
          console.log('Auth state cleared');
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setError('Ошибка при проверке авторизации. Пожалуйста, попробуйте войти снова.');
        user.setUser(null);
        user.setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user]);

  useEffect(() => {
    console.log('Auth state changed:', user.isAuth);
  }, [user.isAuth]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={() => setError(null)}>Попробовать снова</button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavBar user={user} />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
