import { useState } from "react";

export const usePropsHiddenOptions = () => {
  const [propsHideOptions, setPropsHideOptions] = useState<Set<string>>(
    new Set()
  );

  const updatePropHideOptions = (options: Set<string>) => {
    setPropsHideOptions(options);
  };

  return { propsHideOptions, updatePropHideOptions };
};
