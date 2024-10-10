import React, { PropsWithChildren, useEffect, useRef } from "react";
import { useSelectContext } from "./selectContext";
import { classnames } from "../../utill";

type RenderProps = {
  hidden: boolean;
  disabled: boolean;
  value: string;
  onClick: (event: React.MouseEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
};

type OptionProps = PropsWithChildren & {
  value: string;
  hidden?: boolean;
  disabled?: boolean;
  key?: any;
  optionClassName?: string;
  optionSelectedClassName?: string;
  optionRef?: React.MutableRefObject<HTMLLIElement>;
  onRender?: (renderProps: RenderProps) => React.JSX.Element;
};

function Options(props: OptionProps) {
  const {
    value,
    hidden,
    disabled,
    children,
    optionClassName,
    optionSelectedClassName,
    optionRef,
    onRender,
    ...rest
  } = props;
  const {
    propsHideOtpions,
    addAvailableOption,
    removeAvailableOption,
    onSelect,
    onKeyPress,
    setOptionForKeyPress,
    removeOptionForKeyPress,
    isOptionSelected: propsIsOptionSelected,
  } = useSelectContext();
  const liRef = useRef<{ label: string; value: string }>({
    value: value,
    label: "",
  });
  const isOptionSelected = propsIsOptionSelected(value);
  const isOptionHidden = !!hidden || propsHideOtpions.has(value);
  const isOptionDisabled = !!disabled;

  const optionClass = classnames("option", optionClassName, {
    option_selected: isOptionSelected,
    optionSelectedClassName: isOptionSelected && !!optionSelectedClassName,
    option_hidden: isOptionHidden,
    option_disabled: isOptionDisabled,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOptionDisabled || isOptionHidden) return;
    onSelect(value, isOptionHidden);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    onKeyPress(e as React.KeyboardEvent<HTMLButtonElement>);
  };

  const liRefCb = (el: HTMLLIElement | null) => {
    if (!el) return;
    const label = el.textContent ?? "";
    if (optionRef && optionRef.current) {
      optionRef.current = el;
    }
    if (liRef.current.value !== value || liRef.current.label !== label) {
      liRef.current = { value: value, label: label };
      removeAvailableOption(value);
      addAvailableOption(value, { hidden: isOptionHidden, label });
      if (isOptionDisabled) {
        removeOptionForKeyPress(value);
      } else {
        setOptionForKeyPress(value, label);
      }
    }
  };

  return (
    <li
      role='option'
      value={value}
      hidden={isOptionHidden}
      aria-disabled={isOptionDisabled}
      {...rest}
      className={optionClass}
      ref={liRefCb}>
      {typeof onRender === "function" ? (
        onRender({
          hidden: isOptionHidden,
          disabled: isOptionDisabled,
          value,
          onClick: handleClick,
          onKeyDown: handleKeyDown,
        })
      ) : (
        <button
          onKeyDown={handleKeyDown}
          disabled={isOptionDisabled}
          onClick={handleClick}>
          {children}
        </button>
      )}
    </li>
  );
}

export default Options;
