import React, { useContext } from "react";

type SelectContext = {
  addOption: (value: string) => void;
  onSelect: (value: string) => void;
  removeOption: (value: string) => void;
  selectedOption: Set<string>;
};

export const SelectContext = React.createContext<SelectContext>(
  {} as SelectContext
);
export const useSelectContext = () => {
  const context = useContext(SelectContext);
  return context;
};
