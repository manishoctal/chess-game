// import { useRoutes } from 'react-router-dom'
// import { useContext } from 'react'
// import AuthContext from 'context/AuthContext'
// // routes
// import MainRoutes from './MainRoutes'
// import AdminRoutes from './AdminRoutes'

// export default function CombineRoutes () {
//   const { user } = useContext(AuthContext)

//   const checkRoles = {
//     admin: AdminRoutes,
//     subAdmin: AdminRoutes
//     // "company": CompanyRoutes
//   }
//   return useRoutes([user ? checkRoles[user?.role] : MainRoutes], process.env.BASENAME)
// }


import { useRoutes } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
// routes
import MainRoutes from './MainRoutes';
import AdminRoutes from './AdminRoutes';
import NotFound from 'pages/NotFound';

export default function CombineRoutes() {
  const { user } = useContext(AuthContext);

  const checkRoles = {
    admin: AdminRoutes,
    subAdmin: AdminRoutes
    // "company": CompanyRoutes
  };

  const routes = [
    user ? checkRoles[user?.role] : MainRoutes,
    { path: '*', element: <NotFound/> }, // Add the wildcard route for 404
  ];

  return useRoutes(routes, process.env.BASENAME);
}
