import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SelectContext } from "./selectContext";
import Options from "./Options";
import classNames from "classnames";
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
  onSelect?: (value: SelectValue<T>) => void;
};

// type SelectValue = SelectProps["isMult"] extends true ? string[] : string;

export function Select<T extends boolean | undefined = undefined>(
  props: SelectProps<T>
) {
  const {
    children,
    isMult,
    closeOnSelect,
    initialValues,
    selectClassName,
    onSelect: onPropsSelect,
  } = props;

  const [selectedOption, setSelectedOption] = useState<string[] | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const options = useRef<Set<string>>(new Set());
  const selectedOptions = useRef<Set<string>>(new Set());

  const selectClass = classNames("rc_simple_select_root");

  const addOption = (value: string) => {
    options.current.add(value);
  };
  const removeOption = (value: string) => {
    options.current.delete(value);
  };

  const handleSelect = (value: string) => {
    if (selectedOptions.current.has(value)) {
      selectedOptions.current.delete(value);
    } else {
      if (!isMult) {
        selectedOptions.current.clear();
      }
      selectedOptions.current.add(value);
    }
    const newOptions = Array.from(selectedOptions.current);
    setSelectedOption(newOptions);
    onPropsSelect?.(newOptions as SelectValue<T>);
  };

  const onSelect = (value: string) => {
    if (!options.current.has(value)) return;
    handleSelect(value);
    if (closeOnSelect) {
      setShowOptions(false);
    }
  };

  const optionChildren = useMemo(() => {
    const validChildren: React.JSX.Element[] = [];
    let firstNonHiddenChild: React.JSX.Element | null = null;
    if (!children) return null;
    React.Children.forEach(children as any, (child: React.JSX.Element) => {
      if (child.type !== Options || child.props.hidden) return;
      validChildren.push(child);
      if (firstNonHiddenChild === null) firstNonHiddenChild = child;
    });
    if (firstNonHiddenChild !== null && typeof initialValues === "undefined") {
      handleSelect((firstNonHiddenChild as any).props.value);
    }
    return validChildren;
  }, [children]);

  useEffect(() => {
    if (!initialValues) return;
    if (typeof initialValues === "string") {
      setSelectedOption([initialValues]);
    } else if (Array.isArray(initialValues)) {
      setSelectedOption(initialValues);
    }
  }, []);

  return (
    <SelectContext.Provider
      value={{
        onSelect,
        addOption,
        removeOption,
        selectedOption: selectedOptions.current,
      }}>
      <div className={selectClass}>
        <ul>{optionChildren}</ul>
      </div>
    </SelectContext.Provider>
  );
}
