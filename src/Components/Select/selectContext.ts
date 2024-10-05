import React, { useContext } from "react";

type SelectContext = {
  addOption: (value: string) => void;
  onSelect: (value: string) => void;
  removeOption: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  selectedOption: Set<string>;
  propsHideOtpions: Set<string>;
};

export const SelectContext = React.createContext<SelectContext>(
  {} as SelectContext
);
export const useSelectContext = () => {
  const context = useContext(SelectContext);
  return context;
};
