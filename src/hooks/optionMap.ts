import { useRef } from "react";

export const useOptionValueMap = () => {
  const optionMap = useRef<Map<string, string>>(new Map());
  const addOptionValue = (value: string) => {
    const strValue = value.toString();
    const firstCh = strValue.charAt(0);
    optionMap.current.set(firstCh, strValue);
  };
  const getOptionValue = (value: string): string | null => {
    const storevalue = optionMap.current.get(value);
    return storevalue || null;
  };

  return { getOption: getOptionValue, setOption: addOptionValue };
};
