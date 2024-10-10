import { useRef } from "react";

export const useOptionValueMap = () => {
  const optionMap = useRef<Map<string, string>>(new Map());
  const chCount = useRef<Map<string, number>>(new Map());

  const addOptionValue = (value: string, label: string) => {
    const strValue = value.toString().trim();
    const strLabel = label.toString().trim();
    if (!strLabel) return;
    const onlyChar = strLabel.charAt(0).toLowerCase();
    const charCount = chCount.current.get(onlyChar) || 0;
    const charWithCount = `${onlyChar}${charCount}`;
    optionMap.current.set(charWithCount, strValue);
    optionMap.current.set(strValue, charWithCount); // for reverse reference
    chCount.current.set(onlyChar, charCount + 1);
  };

  const removeOptionValue = (value: string) => {
    const strValue = value.toString().trim();
    const reverseValue = optionMap.current.get(strValue);
    if (!reverseValue) return;
    const firstCh = strValue.charAt(0).toLowerCase();
    const charCount = chCount.current.get(firstCh) || 1;
    optionMap.current.delete(strValue);
    optionMap.current.delete(reverseValue);
    chCount.current.set(firstCh, charCount - 1);
  };

  const getOptionValue = (value: string): string | null => {
    const valueLwer = value.toLowerCase();
    const storevalue = optionMap.current.get(valueLwer);
    return storevalue || null;
  };

  const getKeyCount = (key: string) => {
    const keyLwer = key.toLowerCase();
    return chCount.current.get(keyLwer) || 1;
  };

  return {
    getOption: getOptionValue,
    setOption: addOptionValue,
    removeOption: removeOptionValue,
    getKeyCount,
  };
};
