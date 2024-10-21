
interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  required = false,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-medium text-custom-gray">
        {label}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 font-arial text-xs block w-full p-2 border border-custom-gray-200 outline-none py-1 px-3 h-10"
      >
        <option value="" disabled>
          Please Select
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
