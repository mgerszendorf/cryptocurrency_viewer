import React, { useState, createContext } from "react";

const SelectCryptocurrencyContext = createContext<any>(null);

export default SelectCryptocurrencyContext;

export const SelectCryptocurrencyProvider: React.FC<any> = ({ children }) => {
  const [activeUuid, setActiveUuid] = useState<string>("Qwsogvtv82FCd");
  const [newsCategory, setNewsCategory] = useState<string>("Bitcoin");

  function handleSelectCryptocurrency(value: string) {
    const elements = value.split("//");
    setNewsCategory(elements[0]);
    setActiveUuid(elements[1]);
  }

  let contextData = {
    activeUuid: activeUuid,
    newsCategory: newsCategory,
    handleSelectCryptocurrency: handleSelectCryptocurrency,
  };

  return (
    <SelectCryptocurrencyContext.Provider value={contextData}>
      {children}
    </SelectCryptocurrencyContext.Provider>
  );
};
