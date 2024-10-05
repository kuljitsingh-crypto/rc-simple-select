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
import { useOptionValueMap } from "../../hooks";
import { ReactComponent as ArrowDown } from "../svg/downArrow.svg";
import "../../main.css";

type SelectValue<T> = T extends undefined
  ? string
  : T extends true
  ? string[]
  : string;

type SelectProps<T> = PropsWithChildren & {
  isMult?: T;
  initialValues?: SelectValue<T>;
  closeOnSelect?: boolean;
  selectClassName?: string;
  optionWrapperClassName?: string;
  optionShowerClassName?: string;
  isSearchable?: boolean;
  placeholder?: string;
  onSelect?: (value: SelectValue<T>) => void;
};

type OptionShower = PropsWithChildren & {
  isSearchable?: boolean;
  placeholder?: string;
  showOptions: boolean;
  selectedOption: string[] | null;
  optionShowerClassName?: string;
  isMultiple?: boolean;
  getAvailableOptions: () => Set<string>;
  updatePropHideOptions: (options: Set<string>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onClick: () => void;
};

const OptionShower = (props: OptionShower) => {
  const {
    onKeyPress,
    onClick,
    getAvailableOptions,
    updatePropHideOptions,
    isSearchable,
    placeholder,
    showOptions,
    selectedOption,
    optionShowerClassName,
    isMultiple,
  } = props;
  const isOptionSelected = !!selectedOption?.length;
  const optionShowerClass = classnames("option_shower", optionShowerClassName, {
    placeholder: !isOptionSelected,
    show_options: showOptions,
  });
  const [searchText, setSearchText] = useState(renderValue(selectedOption));
  const iconsClass = classnames("icon");
  const inputClass = classnames("input");
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

  const filteredOptions = (value: string) => {
    const options = getAvailableOptions();
    const optionsHidden: Set<string> = new Set();
    if (value) {
      options.forEach((option) => {
        if (!option.toLowerCase().includes(value)) {
          optionsHidden.add(option);
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

  function renderValue(value: any) {
    return value?.toString();
  }

  const getRenderedValue = () => {
    if (isMultiple) {
      return (
        <React.Fragment>
          <span className={inputClass}>
            {renderValue(selectedOption) || placeholder}
          </span>
          {isSearchable ? (
            <input
              type='text'
              placeholder={placeholder}
              autoFocus={false}
              onChange={handleChange}
              value={searchText}
            />
          ) : null}
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {isSearchable ? (
          <input
            type='text'
            placeholder={placeholder}
            autoFocus={false}
            onChange={handleChange}
            value={searchText}
            className={inputClass}
          />
        ) : (
          <span className={inputClass}>
            {renderValue(selectedOption) || placeholder}
          </span>
        )}
      </React.Fragment>
    );
  };
  console.log(selectedOption?.toString(), placeholder);

  useEffect(() => {
    setSearchText(renderValue(selectedOption));
  }, [selectedOption]);

  return (
    <div>
      <button
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className={optionShowerClass}>
        {getRenderedValue()}
        <ArrowDown className={iconsClass} />
      </button>
    </div>
  );
};

export function Select<T extends boolean | undefined = undefined>(
  props: SelectProps<T>
) {
  const {
    children,
    isMult,
    closeOnSelect,
    initialValues,
    selectClassName,
    optionWrapperClassName,
    optionShowerClassName,
    placeholder,
    isSearchable,
    onSelect: onPropsSelect,
  } = props;

  const [selectedOption, setSelectedOption] = useState<string[] | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [propsHideOptions, setPropsHideOptions] = useState<Set<string>>(
    new Set()
  );
  const options = useRef<Set<string>>(new Set());
  const selectedOptions = useRef<Set<string>>(new Set());
  const { setOption, getOption } = useOptionValueMap();

  const selectClass = classnames("root", selectClassName);
  const optionWrapperClass = classnames("options", optionWrapperClassName, {
    show_options: showOptions,
  });

  const addOption = (value: string) => {
    options.current.add(value);
  };
  const removeOption = (value: string) => {
    options.current.delete(value);
  };

  const getAvailableOptions = () => {
    return options.current;
  };

  const handleSelect = (value: string, shouldDeleteIfKeyExist = true) => {
    if (selectedOptions.current.has(value) && shouldDeleteIfKeyExist) {
      selectedOptions.current.delete(value);
    } else {
      if (!isMult) {
        selectedOptions.current.clear();
      }
      selectedOptions.current.add(value);
    }
    const newOptions = Array.from(selectedOptions.current);
    setSelectedOption(newOptions);
    const propOptions = isMult ? newOptions : newOptions[0];
    onPropsSelect?.(propOptions as SelectValue<T>);
  };

  const onSelect = (value: string) => {
    if (!options.current.has(value)) return;
    handleSelect(value, false);
    if (closeOnSelect) {
      setShowOptions(false);
    }
  };

  const updatePropHideOptions = (options: Set<string>) => {
    setPropsHideOptions(options);
  };

  //================== event handlers =================

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { key } = e;
    const shouldReturn = key.length > 1;
    if (shouldReturn) return;
    const value = getOption(key);
    if (!value) return;
    handleSelect(value, false);
  };

  const handleClick = () => {
    setShowOptions((options) => !options);
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
      addOption(child.props.value);
      if (!child.props.disabled) {
        setOption(child.props.value);
      }
    });
    if (firstNonHiddenChild !== null && typeof initialValues === "undefined") {
      handleSelect((firstNonHiddenChild as any).props.value);
    }
    return validChildren;
  }, [children]);

  useEffect(() => {
    if (!initialValues) return;
    if (Array.isArray(initialValues)) {
      selectedOptions.current = new Set(initialValues);
      setSelectedOption(initialValues);
    } else {
      const stringValue = initialValues?.toString() || "";
      setSelectedOption([stringValue]);
    }
  }, []);

  console.log(selectedOption);
  return (
    <SelectContext.Provider
      value={{
        onSelect,
        addOption,
        removeOption,
        onKeyPress: handleKeyDown,
        selectedOption: selectedOptions.current,
        propsHideOtpions: propsHideOptions,
      }}>
      <div className={selectClass}>
        <OptionShower
          placeholder={placeholder}
          showOptions={showOptions}
          selectedOption={selectedOption}
          optionShowerClassName={optionShowerClassName}
          isSearchable={isSearchable}
          isMultiple={isMult}
          getAvailableOptions={getAvailableOptions}
          updatePropHideOptions={updatePropHideOptions}
          onClick={handleClick}
          onKeyPress={handleKeyDown}
        />

        <ul className={optionWrapperClass}>{optionChildren}</ul>
      </div>
    </SelectContext.Provider>
  );
}
