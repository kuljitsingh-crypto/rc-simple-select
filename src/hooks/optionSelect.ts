import { useEffect, useRef, useState } from "react";

const MAX_COUNT = 30;
const MIN_COUNT = 1;
type HandleSelectParams = {
  value: string;
  isMultiple?: boolean;
  isHidden: boolean;
  checkForHidden: boolean;
};

export type LocalOptionsType = Map<string, { hidden: boolean }>;
export type OptionRefType = Map<
  string,
  { hidden: boolean; label: string | null; value: string }
>;

// const initialzeGlobalOptions = (initialValue?: string | string[]) => () => {
//   if (!initialValue) return [];
//   if (Array.isArray(initialValue)) {
//     return [...initialValue];
//   } else {
//     const stringValue = initialValue?.toString() || "";
//     return [stringValue];
//   }
// };

export const useSelectOptions = ({
  initialValue,
  isMultiple,
}: {
  initialValue?: string | string[];
  isMultiple: boolean;
}) => {
  const [optionChanged, setOptionChanged] = useState(0);
  const localSelectedOptions = useRef<LocalOptionsType | null>(null);
  const availableOptions = useRef<OptionRefType | null>(null);
  if (availableOptions.current === null) {
    availableOptions.current = new Map();
  }

  const initializeLocalOptions = (
    isMultiple: boolean,
    initialValue?: string | string[]
  ) => {
    const map = new Map() as LocalOptionsType;
    if (initialValue) {
      if (isMultiple) {
        const arrInitialValue = Array.isArray(initialValue)
          ? initialValue
          : [initialValue];
        arrInitialValue.forEach((value) => {
          map.set(value, { hidden: false });
        });
      } else {
        const stringValue = Array.isArray(initialValue)
          ? initialValue[0]
          : initialValue?.toString() || "";
        if (stringValue) {
          map.set(stringValue, { hidden: false });
        }
      }
      setOptionChanged(1);
    }
    localSelectedOptions.current = map;
  };

  const updateOptionChangedCount = (count: number) => {
    const paddedCount = (optionChanged + 1) % MAX_COUNT;
    return paddedCount >= MIN_COUNT ? paddedCount : paddedCount + MIN_COUNT;
  };

  const updateGlobalSelectedOptions = () => {
    const selectedOptions = Array.from(
      localSelectedOptions.current?.keys() || []
    );
    setOptionChanged(updateOptionChangedCount);
    return selectedOptions;
  };

  const handleSelect = ({
    value,
    checkForHidden,
    isMultiple,
    isHidden,
  }: HandleSelectParams) => {
    const isValidValue = !checkForHidden || !isHidden;
    if (!isMultiple) {
      if (isValidValue) {
        localSelectedOptions.current?.clear();
        localSelectedOptions.current?.set(value, {
          hidden: isHidden,
        });
      }
    } else {
      if (localSelectedOptions.current?.has(value)) {
        localSelectedOptions.current?.delete(value);
      } else {
        const currentSize = localSelectedOptions.current?.size || 0;
        if (currentSize === 1) {
          const [key, keyValue] =
            localSelectedOptions.current?.entries().next().value || [];
          if (keyValue?.hidden && key) {
            localSelectedOptions.current?.delete(key);
          }
        }
        if (isValidValue) {
          localSelectedOptions.current?.set(value, {
            hidden: isHidden,
          });
        }
      }
    }
    return updateGlobalSelectedOptions();
  };

  const handleDelete = (value: string) => {
    localSelectedOptions.current?.delete(value);
    return updateGlobalSelectedOptions();
  };

  const addOption = (
    value: string,
    { hidden, label }: { hidden: boolean; label: string | null }
  ) => {
    availableOptions.current?.set(value, { hidden: hidden, label, value });
  };
  const removeOption = (value: string) => {
    availableOptions.current?.delete(value);
  };

  const getAvailableOptions = () => {
    const options = Array.from(availableOptions.current?.values() || []);
    return options;
  };
  const isOptionExist = (value: string) => {
    return !!availableOptions.current?.has(value);
  };

  const isOptionHidden = (value: string) => {
    const option = availableOptions.current?.get(value);
    return option;
  };

  const isOptionSelected = (value: string) => {
    return !!localSelectedOptions.current?.has(value);
  };

  const getSelectedOptions = () => {
    const keys = localSelectedOptions.current?.keys();
    const selectedOptions = [];
    while (true) {
      const { done, value } = keys?.next() ?? { done: true, value: undefined };
      if (done) {
        break;
      }
      const optionRef = availableOptions.current?.get(value);
      if (optionRef) {
        selectedOptions.push({
          value: optionRef.value,
          label: optionRef.label,
        });
      }
    }
    return selectedOptions;
  };

  useEffect(() => {
    initializeLocalOptions(isMultiple, initialValue);
  }, [initialValue, isMultiple]);

  return {
    handleOptionSelect: handleSelect,
    handleOptionRemove: handleDelete,
    addOption,
    removeOption,
    getAvailableOptions,
    isOptionExist,
    isOptionHidden,
    isOptionSelected,
    getSelectedOptions,
    optionChanged,
  };
};
