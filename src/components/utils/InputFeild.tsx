interface InputFieldProps {
  label?: string;
  type: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  classes?: string;
}

const InputField = ({
  label,
  type,
  id,
  name,
  required = false,
  value,
  onChange,
  placeholder,
  error,
  classes,
}: InputFieldProps) => {
  return (
    <>
      <div className={`${label ? "mb-4" : ""}`}>
        <label htmlFor={id} className=" font-medium text-custom-gray">
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={name}
          min={1}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`mt-1 font-arial text-xs block w-full p-2 border border-inset border-custom-gray-200 outline-none py-1 px-3 h-10 ${
            error ? "border-red-500" : "border-custom-gray-200"
          }  ${classes}`}
        />
        {
          <span className="text-red-500 h-6 text-[10px] font-bold">
            {error ? error : ""}
          </span>
        }
      </div>
    </>
  );
};

export default InputField;
