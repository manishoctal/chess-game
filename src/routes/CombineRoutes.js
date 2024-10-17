import { useRoutes } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import MainRoutes from './MainRoutes';
import AdminRoutes from './AdminRoutes';
import NotFound from 'pages/NotFound';

export default function CombineRoutes() {
  const { user } = useContext(AuthContext);

  const checkRoles = {
    admin: AdminRoutes,
    subAdmin: AdminRoutes
  };

  const routes = [
    user ? checkRoles[user?.role] : MainRoutes,
    { path: '*', element: <NotFound/> },
  ];

  return useRoutes(routes, process.env.BASENAME);
}
