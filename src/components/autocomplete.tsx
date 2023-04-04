import { ChangeEvent, useEffect, useRef, useState } from "react";

interface Props<T> {
  className?: string;
  filter: (val: string) => T[];
  toLabel: (val: T) => string;
  onSelect: (val: T) => void;
}

export const Autocomplete = <T,>(props: Props<T>) => {
  const [options, setOptions] = useState<T[]>(props.filter(""));
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filteredValues = props.filter(inputValue);
    filteredValues.sort((a, b) => props.toLabel(a).localeCompare(props.toLabel(b)));
    setOptions(filteredValues);
  }, [props.filter]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOptions(props.filter(e.target.value));
    setInputValue(e.target.value);
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (e.currentTarget.parentElement?.contains(e.relatedTarget)) {
      return;
    }
    setIsOpen(false);
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    setIsOpen(true);
  };

  const onValueSelected = (val: T) => {
    setIsOpen(false);
    setInputValue("");
    props.onSelect(val);
  };

  return (
    <div className={`relative ${props.className ?? ""}`}>
      <input
        ref={input}
        className="border-b border-b-neutral-600 bg-transparent px-1 font-light outline-none"
        onChange={onInputChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        value={inputValue}
        placeholder="Insira o nome do atleta"
      />
      {isOpen && (
        <div className="absolute max-h-80 overflow-y-auto" style={{ width: input.current?.offsetWidth }}>
          {options.map((option, idx) => (
            <div
              className="cursor-pointer border-b border-solid border-b-neutral-700 bg-neutral-800 p-4 hover:bg-neutral-700 focus:bg-neutral-700 active:bg-neutral-700"
              key={idx}
              tabIndex={0}
              onBlur={handleOnBlur}
              onClick={() => onValueSelected(option)}
            >
              {props.toLabel(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
