import Admin from "./pages/Admin";
import Basket from "./pages/Basket";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import ProductPage from "./pages/ProductPage";
import Catalog from "./pages/Catalog";
import Favorites from "./pages/Favorites";
import AdminPanel from "./pages/AdminPanel";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, PRODUCT_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, CATALOG_ROUTE, FAVORITES_ROUTE, ADMIN_PANEL_ROUTE} from "./utils/consts";  // Добавляем новый маршрут

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    { 
        path: ADMIN_PANEL_ROUTE, 
        Component: AdminPanel 
    },
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: CATALOG_ROUTE, 
        Component: Catalog
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: ProductPage
    },
    {
        path: FAVORITES_ROUTE,  
        Component: Favorites
    },
]
