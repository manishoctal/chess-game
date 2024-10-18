import React, { createContext, useMemo } from 'react';

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const adminData = useMemo(() => {
    return {

    };
  }, []); 

  return (
    <AdminContext.Provider value={adminData}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContext;
