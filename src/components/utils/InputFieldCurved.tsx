// interface InputFieldCurvedProps {
//   label?: string;
//   type: string;
//   id: string;
//   name: string;
//   readonly?: boolean;
//   placeholder?: string;
//   required?: boolean;
//   value?: string | number;
//   checked?: boolean;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   error?: string;
//   classes?: string;
//   maxlength?: number;
//   maxUnit?: number;
//   disabled?: boolean;
//   inputRef?: React.RefObject<HTMLInputElement>;
// }

// const InputFieldCurved = ({
//   label,
//   type,
//   id,
//   name,
//   inputRef,
//   maxlength,
//   disabled = false,
//   required = false,
//   value,
//   maxUnit,
//   onChange,
//   placeholder,
//   checked,
//   readonly = false,
//   error,
//   classes,
// }: InputFieldCurvedProps) => {
//   console.log(inputRef?.current)
//   return (
//     <>
//       <div className={`${label ? "mb-4" : ""}`}>
//         <label
//           htmlFor={id}
//           className=" text-[12px] lg:text-[14px] text-[#666666]"
//         >
//           {label}
//         </label>
//         <input
//           key={id}
//           // autoFocus
//           type={type}
//           {...(maxlength && { maxLength: maxlength })}
//           {...(maxUnit && { max: maxUnit })}
//           {...(inputRef && { ref: inputRef })}
//           disabled={disabled}
//           id={id}
//           readOnly={readonly}
//           name={name}
//           // min={1}
//           {...(type === "number" || type === "range" ? { min: 1 } : {})}
//           required={required}
//           {...(type === "checkbox"
//             ? { checked: checked || false }
//             : { value: value || "" })}
//           // value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className={`mt-1 text-[#666666] text-xs font-noto-sans rounded-md block w-full  py-3.5 border border-inset border-custom-gray-200 outline-none  px-3 h-12 ${
//             error ? "border-red-500" : "border-[#CCCCCC]"
//           }  ${classes}`}
//         />
//         {
//           <span className="text-red-500 h-6 text-[10px] font-bold">
//             {error ? error : ""}
//           </span>
//         }
//       </div>
//     </>
//   );
// };

// export default InputFieldCurved;

import React from "react";

interface InputFieldCurvedProps {
  label?: string;
  type: string;
  id: string;
  name: string;
  readonly?: boolean;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  classes?: string;
  maxlength?: number;
  maxUnit?: number;
  disabled?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

const InputFieldCurved = React.forwardRef<HTMLInputElement,InputFieldCurvedProps>(({label,type,id,name,maxlength,disabled = false,required = false,value,maxUnit,onChange,placeholder,checked,readonly = false,error,classes,},ref) => {
    return (
      <div className={`${label ? "mb-4" : ""}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-[12px] font-medium lg:text-[14px] text-[#666666]"
          >
            {label}
          </label>
        )}
        <input
        type={type}
          {...(maxlength && { maxLength: maxlength })}
          {...(maxUnit && { max: maxUnit })}
          ref={ref}
          disabled={disabled}
          id={id}
          readOnly={readonly}
          name={name}
          {...(type === "number" || type === "range" ? { min: 1 } : {})}
          required={required}
          {...(type === "checkbox"
            ? { checked: checked || false }
            : { value: value || "" })}
          onChange={onChange}
          placeholder={placeholder}
          className={`mt-1 text-[#666666] text-xs font-noto-sans rounded-md block w-full py-2.5 lg:py-3.5 border border-inset border-custom-gray-200 outline-none px-3 h-8 xl:h-12 ${
            error ? "border-red-500" : "border-[#CCCCCC]"
          } ${classes}`}
        />
        {error && (
          <span className="text-red-500 h-6 text-[10px] font-bold">
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default InputFieldCurved;
