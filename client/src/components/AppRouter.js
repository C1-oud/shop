import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE, ADMIN_PANEL_ROUTE } from "../utils/consts";
import { Context } from '../index';
import AdminPanel from '../pages/AdminPanel';

const AppRouter = () => {
    const { user } = useContext(Context);
    const isAuth = user.isAuth;
    const isAdmin = user.isAdmin;

    return (
        <Routes>
            {isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}

            {isAdmin && <Route path={ADMIN_PANEL_ROUTE} element={<AdminPanel />} />}

            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}

            <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter;
