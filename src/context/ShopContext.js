import React, { createContext, useState, useContext } from 'react';

// Create a new context
const ShopContext = createContext();

// Create a provider component
export const ShopProvider = ({ children }) => {
  // State to store global data
  const [shopData, setShopData] = useState({
    activeTab: '',
    isNavBarOpen: false,
    notifCount: 0,
    codeOrdersCount: 0,
    serverOrdersCount: 0,
    panelOrdersCount: 0,
    totalOrdersCount: 0
  });

  // Function to update shop data
  const updateShopData = (newData) => {
    setShopData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <ShopContext.Provider value={{ shopData, updateShopData }}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook to access shop data and update function
export const useShop = () => useContext(ShopContext);
