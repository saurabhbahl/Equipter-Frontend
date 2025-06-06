import React from "react";

interface SelectFieldProps {
  label: string;
  id: string;
  classes?: string;
  defaultValue?: string;
  name: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  labelClasses?:string;
  disabled?:boolean
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  labelClasses,
  name,
  classes,
  disabled=false,
  defaultValue,
  required = false,
  options,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className={`block font-medium text-custom-gray  ${labelClasses}`}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        value={value}
        onChange={onChange}
        className={`mt-1 font-arial text-xs block w-full p-2 border ${
          error ? "border-red-500" : "border-custom-gray-200"
        } outline-none py-1 px-3 h-10 ${classes}`}
      >
        <option value="">
          {`${defaultValue ? defaultValue : "Please Select"}`}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 h-6 text-[10px] font-bold">{error}</span>}
    </div>
  );
};

export default SelectField;
