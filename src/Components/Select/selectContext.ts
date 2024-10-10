import React, { useContext } from "react";

type SelectContext = {
  addAvailableOption: (
    value: string,
    options: { hidden: boolean; label: string }
  ) => void;
  onSelect: (value: string, hidden: boolean) => void;
  removeAvailableOption: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  isOptionSelected: (value: string) => boolean;
  setOptionForKeyPress: (value: string, label: string) => void;
  removeOptionForKeyPress: (value: string) => void;
  propsHideOtpions: Set<string>;
};

export const SelectContext = React.createContext<SelectContext>(
  {} as SelectContext
);
export const useSelectContext = () => {
  const context = useContext(SelectContext);
  return context;
};
