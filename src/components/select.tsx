import React, { useState } from "react";

export interface OptionType<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
  value: OptionType<T>;
  options: OptionType<T>[];
  onChange: (newValue: T) => void;
  renderOption?: (option: OptionType<T>) => React.ReactNode;
}

interface OptionProps<T> {
  option: OptionType<T>;
  renderOption?: (option: OptionType<T>) => React.ReactNode;
}

export function Select<T>({ value, options, onChange, renderOption }: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const renderCustomOption = (option: OptionType<T>) => {
    if (renderOption) {
      return renderOption(option);
    }
    return <CustomOption option={option} />;
  };

  const handleKeyEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter" || e.code === "Space") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleKeyEventOnOption = (e: React.KeyboardEvent<HTMLDivElement>, val: T) => {
    if (e.code === "Enter" || e.code === "Space") {
      e.stopPropagation();
      e.preventDefault();
      handleOptionClick(val);
    }
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsOpen(false);
  };

  return (
    <div role="combobox" className="relative" tabIndex={0} onBlur={handleOnBlur} onKeyDown={(e) => handleKeyEvent(e)}>
      <div className="flex cursor-pointer items-center" onClick={handleSelectClick}>
        <div className="p-2">{renderCustomOption(value)}</div>
        {/* Arrow */}
        <div className="mx-2 h-0 w-0 border-t-4 border-l-4 border-r-4 border-solid border-t-neutral-500 border-l-transparent border-r-transparent"></div>
      </div>
      {isOpen && (
        <div className="absolute top-8 z-10 cursor-pointer bg-neutral-800 ">
          {options.map((option, idx) => (
            <div
              key={idx}
              role="option"
              className={`p-4 hover:bg-neutral-600 ${option.value === value.value ? "bg-neutral-700" : ""}`}
              tabIndex={0}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => handleKeyEventOnOption(e, option.value)}
            >
              {renderCustomOption(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomOption<T>({ option, renderOption }: OptionProps<T>) {
  if (renderOption) {
    return <>{renderOption(option)}</>;
  }
  return <div>{option.label}</div>;
}
