import { ForwardedRef, forwardRef, SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: Option[];
}

const Select = forwardRef(
  (
    { id, label, options }: SelectProps,
    ref: ForwardedRef<HTMLSelectElement>,
  ) => {
    return (
      <div className="w-full space-y-0.5">
        <label
          htmlFor={id}
          className="block mb-2 ml-1 text-sm font-medium text-gray-600"
        >
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          name={id}
          className="mt-1 block w-full rounded-md border bg-white px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 outline-none focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

export default Select;
