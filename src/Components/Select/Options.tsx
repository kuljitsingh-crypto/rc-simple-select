import React, { PropsWithChildren, useEffect } from "react";
import { useSelectContext } from "./selectContext";

type OptionProps = PropsWithChildren & {
  value: string;
  hidden?: boolean;
  disabled?: boolean;
  key?: any;
};

function Options(props: OptionProps) {
  const { value, hidden, disabled, children, ...rest } = props;
  const { addOption, removeOption, selectedOption, onSelect } =
    useSelectContext();

  const isOptionSelected = !!selectedOption?.has(value);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(value);
  };

  useEffect(() => {
    addOption(value);
    return () => {
      removeOption(value);
    };
  }, []);

  return (
    <li
      role='option'
      value={value}
      hidden={hidden}
      {...rest}
      onClick={handleClick}>
      {children}
    </li>
  );
}

export default Options;
