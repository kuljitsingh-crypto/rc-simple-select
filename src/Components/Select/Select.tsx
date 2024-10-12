import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SelectContext } from "./selectContext";
import Options from "./Options";
import { classnames } from "../../utill";
import {
  useOptionValueMap,
  usePropsHiddenOptions,
  useSelectOptions,
} from "../../hooks";
import { ReactComponent as ArrowDown } from "../svg/downArrow.svg";
import { ReactComponent as CloseIcon } from "../svg/close.svg";
import "../../main.css";

const defaultInputPlaceholder = "Select...";
const defaultSelectPlaceholder = "Select...";

type SelectValue<T> = T extends undefined
  ? string
  : T extends true
  ? string[]
  : string;

type SelectProps<T> = PropsWithChildren & {
  isMulti?: T;
  values?: SelectValue<T>;
  closeOnSelect?: boolean;
  selectClassName?: string;
  optionWrapperClassName?: string;
  optionShowerClassName?: string;
  isSearchable?: boolean;
  placeholder?: string;
  inputPlaceholder?: string;
  label?: string | React.ReactNode;
  selectRef?: React.MutableRefObject<HTMLDivElement>;
  IconComponent?: (props: {
    className: string;
    isMenuOpen: boolean;
    isAnyOptionSelected: boolean;
  }) => React.JSX.Element;
  onSelect?: (value: SelectValue<T>) => void;
  renderValue?: (
    value: {
      value: string;
      label: string | null;
    }[],
    onClose?: (value: string) => (event: React.MouseEvent) => void
  ) => React.JSX.Element[] | null;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
};

type OptionShower = PropsWithChildren & {
  isSearchable?: boolean;
  placeholder?: string;
  inputPlaceholder?: string;
  showOptions: boolean;
  optionShowerClassName?: string;
  isMultiple?: boolean;
  optionChanged: number;
  label?: string | React.ReactNode;
  IconComponent?: (props: {
    className: string;
    isMenuOpen: boolean;
    isAnyOptionSelected: boolean;
  }) => React.JSX.Element;
  getSelectedOptions: () => {
    value: string;
    label: string | null;
  }[];
  getAvailableOptions: () => {
    hidden: boolean;
    label: string | null;
    value: string;
  }[];
  updatePropHideOptions: (options: Set<string>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onClick: () => void;
  handleRemove: (value: string) => void;
  renderValue?: (
    value: {
      value: string;
      label: string | null;
    }[],
    onClose?: (value: string) => (event: React.MouseEvent) => void
  ) => React.JSX.Element[] | null;
};

const OptionShower = (props: OptionShower) => {
  const {
    onKeyPress,
    onClick,
    getAvailableOptions,
    updatePropHideOptions,
    getSelectedOptions,
    handleRemove,
    renderValue: propsRenderValue,
    IconComponent,
    isSearchable,
    placeholder,
    showOptions,
    optionChanged,
    optionShowerClassName,
    isMultiple,
    inputPlaceholder,
    label,
  } = props;
  const [searchText, setSearchText] = useState("");
  const selectedOptions = useMemo(getSelectedOptions, [optionChanged]);
  const selectedOptionsCount = selectedOptions.length;
  const isOptionSelected = !!selectedOptionsCount || !!searchText;
  const isMultipleOptionSelected = !!(isMultiple && selectedOptionsCount);
  const optionShowerClass = classnames(
    "option_shower",
    { classname: optionShowerClassName, addClassPrefix: false },
    {
      placeholder: !isOptionSelected,
      show_options: showOptions,
      multi_select_options: !!(isMultiple && selectedOptionsCount),
      wrap_options: !!(isMultiple && isSearchable),
    }
  );
  const iconsClass = classnames("icon");
  const inputClass = classnames("input", {
    hidden_input: !showOptions,
    empty_input: !searchText,
  });
  const spanClass = classnames("span", {
    hidden_span: !!(!isMultiple && isSearchable && showOptions),
    single_span: !isMultiple,
    visible_multi_span: !!(isMultiple && !showOptions),
    multi_span: !!isMultiple,
  });

  const optionContentClass = classnames("option_content");
  const multiSelectSpanClass = classnames("multi_select_span");
  const labelClass = classnames("label");
  const renderedValue =
    typeof propsRenderValue === "function"
      ? propsRenderValue(selectedOptions, onDeleteOption)
      : renderValue(selectedOptions, onDeleteOption);

  const emptyRenderedValue = !renderedValue || renderedValue.length === 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isSearchable) {
      onKeyPress(e);
    }
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const handleInputClicked = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const filteredOptions = (value: string) => {
    const options = getAvailableOptions();
    const optionsHidden: Set<string> = new Set();
    const valueRegex = new RegExp(value, "i");

    if (value) {
      options.forEach((option) => {
        if (!valueRegex.test(option.label || "")) {
          optionsHidden.add(option.value);
        }
      });
    }
    updatePropHideOptions(optionsHidden);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;
    setSearchText(value);
    filteredOptions(value);
  };

  const resetSearchText = () => {
    let seachText = "";
    if (!isMultiple) {
      const [option] = getSelectedOptions() || [];
      seachText = option?.label || "";
    }
    setSearchText(seachText);
    updatePropHideOptions(new Set());
  };

  const inputRefCb = (el: HTMLInputElement | null) => {
    if (!el) return;
    el.focus();
  };

  function onDeleteOption(value: string) {
    return (e: React.MouseEvent) => {
      if (!isMultiple) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      handleRemove(value);
    };
  }

  function renderValue(
    value: {
      value: string;
      label: string | null;
    }[],
    onClose?: (value: string) => (event: React.MouseEvent) => void
  ) {
    return value.length > 0
      ? value.map((v, index) => {
          const spanContent = isMultiple ? (
            <span
              className={multiSelectSpanClass}
              role='button'
              onClick={onClose?.(v.value)}>
              <span>{v.label}</span>
              <CloseIcon />
            </span>
          ) : (
            <span>{v.label}</span>
          );

          return <React.Fragment key={v.value}>{spanContent}</React.Fragment>;
        })
      : null;
  }

  const inputElement = (
    <input
      type='text'
      placeholder={
        isMultipleOptionSelected
          ? ""
          : inputPlaceholder || defaultInputPlaceholder
      }
      autoFocus={false}
      onChange={handleChange}
      value={searchText}
      className={inputClass}
      ref={inputRefCb}
      onClick={handleInputClicked}
    />
  );

  const spanPlaceholder =
    isMultiple && isSearchable && showOptions
      ? ""
      : placeholder || defaultInputPlaceholder;

  useEffect(() => {
    resetSearchText();
  }, [optionChanged, showOptions]);

  return (
    <div>
      {label ? <p className={labelClass}>{label}</p> : null}
      <button
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className={optionShowerClass}>
        <span className={optionContentClass}>
          <span className={spanClass}>
            {emptyRenderedValue ? spanPlaceholder : renderedValue}
            {isMultiple && isSearchable ? inputElement : null}
          </span>
          {isSearchable && !isMultiple ? inputElement : null}
        </span>
        {typeof IconComponent !== "undefined" ? (
          <IconComponent
            className={iconsClass}
            isMenuOpen={showOptions}
            isAnyOptionSelected={isOptionSelected}
          />
        ) : (
          <ArrowDown className={iconsClass} />
        )}
      </button>
    </div>
  );
};

export function Select<T extends boolean | undefined = undefined>(
  props: SelectProps<T>
) {
  const {
    children,
    isMulti,
    closeOnSelect = true,
    values,
    selectClassName,
    optionWrapperClassName,
    optionShowerClassName,
    placeholder,
    isSearchable,
    inputPlaceholder,
    label,
    selectRef,
    onSelect: onPropsSelect,
    renderValue,
    IconComponent,
    onMenuClose,
    onMenuOpen,
  } = props;
  const [showOptions, setShowOptions] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const keyPressCount = useRef({ key: "", count: 0 });
  const {
    setOption: setOptionForKeyPress,
    getOption,
    removeOption: removeOptionForKeyPress,
    getKeyCount,
  } = useOptionValueMap();
  const { propsHideOptions, updatePropHideOptions } = usePropsHiddenOptions();
  const {
    handleOptionSelect,
    handleOptionRemove,
    addOption: addAvailableOption,
    removeOption: removeAvailableOption,
    isOptionExist,
    getAvailableOptions,
    isOptionHidden,
    isOptionSelected,
    getSelectedOptions,
    optionChanged,
  } = useSelectOptions({ initialValue: values, isMultiple: !!isMulti });

  const selectClass = classnames("root", {
    classname: selectClassName,
    addClassPrefix: false,
  });
  const optionWrapperClass = classnames(
    "options",
    { classname: optionWrapperClassName, addClassPrefix: false },
    {
      show_options: showOptions,
    }
  );

  const handleSelect = (
    value: string,
    {
      hidden,
      shouldCallPropOnselect = true,
      checkForHidden = true,
    }: {
      hidden: boolean;
      shouldCallPropOnselect?: boolean;
      checkForHidden?: boolean;
    }
  ) => {
    const newOptions = handleOptionSelect({
      value,
      isHidden: hidden,
      isMultiple: !!isMulti,
      checkForHidden,
    });
    const propOptions = isMulti ? newOptions : newOptions[0];
    if (shouldCallPropOnselect) {
      onPropsSelect?.(propOptions as SelectValue<T>);
    }
  };

  const handleRemove = (value: string) => {
    const newOptions = handleOptionRemove(value);
    const propOptions = isMulti ? newOptions : newOptions[0];
    onPropsSelect?.(propOptions as SelectValue<T>);
  };

  const onSelect = (value: string, hidden: boolean) => {
    if (!isOptionExist(value)) return;
    handleSelect(value, { hidden });
    if (closeOnSelect) {
      setShowOptions(false);
    }
  };

  const extractString = (obj: React.JSX.Element): string => {
    if (typeof obj === "string") return obj;
    else if (React.isValidElement(obj)) {
      return extractString((obj.props as any).children);
    } else if (Array.isArray(obj)) {
      return obj.map((e) => extractString(e)).join(" ");
    } else return obj.toString();
  };

  const getKeyPressCoount = (key: string) => {
    return keyPressCount.current.key === key ? keyPressCount.current.count : 0;
  };

  const setKeyPressCount = (key: string, count: number) => {
    keyPressCount.current = { key: key, count: count };
  };

  const divRefCb = (el: HTMLDivElement | null) => {
    if (el) {
      divRef.current = el;
      if (selectRef && selectRef.current) {
        selectRef.current = el;
      }
    }
  };

  //================== event handlers =================

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isSearchable) return;
    e.preventDefault();
    e.stopPropagation();
    const { key } = e;
    const shouldReturn = key.length > 1;
    if (shouldReturn) return;
    const keyLwr = key.toLowerCase();
    const charCount = getKeyPressCoount(keyLwr);
    const keyWithCount = `${keyLwr}${charCount}`;
    const value = getOption(keyWithCount);
    if (!value) return;
    const valueStatus = isOptionHidden(value);
    if (!valueStatus) return;
    handleSelect(value, { hidden: valueStatus.hidden });
    const maxCount = getKeyCount(keyLwr);
    const newCount = (charCount + 1) % maxCount;
    setKeyPressCount(keyLwr, newCount);
  };

  const handleClick = () => {
    setShowOptions((options) => !options);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!divRef.current || !e) return;
    if (!divRef.current.contains(e.relatedTarget as any)) {
      setShowOptions(false);
    }
  };

  //========================= event handlers =================

  const optionChildren = useMemo(() => {
    const validChildren: React.JSX.Element[] = [];
    let firstNonHiddenChild: React.JSX.Element | null = null;
    if (!children) return null;
    React.Children.forEach(children as any, (child: React.JSX.Element) => {
      if (child.type !== Options) return;
      validChildren.push(child);
      if (firstNonHiddenChild === null && !child.props.disabled) {
        firstNonHiddenChild = child;
      }
      // if (!child.props.disabled) {
      //   setOption(child.props.value);
      // }
    });

    // if (firstNonHiddenChild !== null && typeof initialValues === "undefined") {
    //   const child = firstNonHiddenChild as React.JSX.Element;
    //   const isHidden = !!child.props.hidden;
    //   const label = extractString(child);
    //   addOption(child.props.value, { hidden: !!child.props.hidden, label });
    //   handleSelect(child.props.value, {
    //     shouldCallPropOnselect: !isHidden,
    //     hidden: isHidden,
    //     checkForHidden: false,
    //   });
    // }
    return validChildren;
  }, [children]);

  useEffect(() => {
    if (showOptions) {
      onMenuOpen?.();
    } else {
      onMenuClose?.();
    }
  }, [showOptions]);

  return (
    <SelectContext.Provider
      value={{
        onSelect,
        addAvailableOption,
        removeAvailableOption,
        onKeyPress: handleKeyDown,
        isOptionSelected,
        setOptionForKeyPress,
        removeOptionForKeyPress,
        propsHideOtpions: propsHideOptions,
      }}>
      <div
        className={selectClass}
        tabIndex={0}
        onBlur={handleBlur}
        ref={divRefCb}>
        <OptionShower
          placeholder={placeholder}
          showOptions={showOptions}
          optionShowerClassName={optionShowerClassName}
          isSearchable={isSearchable}
          isMultiple={isMulti}
          optionChanged={optionChanged}
          inputPlaceholder={inputPlaceholder}
          label={label}
          getSelectedOptions={getSelectedOptions}
          getAvailableOptions={getAvailableOptions}
          updatePropHideOptions={updatePropHideOptions}
          onClick={handleClick}
          onKeyPress={handleKeyDown}
          handleRemove={handleRemove}
          renderValue={renderValue}
          IconComponent={IconComponent}
        />

        <ul className={optionWrapperClass} role='listbox'>
          {optionChildren}
        </ul>
      </div>
    </SelectContext.Provider>
  );
}
