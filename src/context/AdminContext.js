import React, { createContext } from 'react'
const AdminContext = createContext()

export const AdminContextProvider = ({ children }) => {
  const adminData = {
  }

  return (
    <AdminContext.Provider value={adminData}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext
