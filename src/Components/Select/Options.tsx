import React, { PropsWithChildren, useEffect } from "react";
import { useSelectContext } from "./selectContext";
import { classnames } from "../../utill";

type OptionProps = PropsWithChildren & {
  value: string;
  hidden?: boolean;
  disabled?: boolean;
  key?: any;
  optionClassName?: string;
  optionSelectedClassName?: string;
};

function Options(props: OptionProps) {
  const {
    value,
    hidden,
    disabled,
    children,
    optionClassName,
    optionSelectedClassName,
    ...rest
  } = props;
  const {
    selectedOption,
    propsHideOtpions,
    addOption,
    removeOption,
    onSelect,
    onKeyPress,
  } = useSelectContext();

  const isOptionSelected = !!selectedOption?.has(value);
  const isOptionHidden = !!hidden || propsHideOtpions.has(value);
  const isOptionDisabled = !!disabled || propsHideOtpions.has(value);

  const optionClass = classnames("option", optionClassName, {
    option_selected: isOptionSelected,
    optionSelectedClassName: isOptionSelected && !!optionSelectedClassName,
    option_hidden: isOptionHidden,
    option_disabled: isOptionDisabled,
  });

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || hidden) return;
    onSelect(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyPress(e);
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
      hidden={isOptionHidden}
      aria-disabled={isOptionDisabled}
      {...rest}
      className={optionClass}
      onClick={handleClick}>
      <button onKeyDown={handleKeyDown} disabled={isOptionDisabled}>
        {children}
      </button>
    </li>
  );
}

export default Options;
