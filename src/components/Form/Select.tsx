import classNames from '@/utils/bindClassNames';
import { ForwardedRef, forwardRef, SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: Option[];
  error?: boolean;
  errorMessage?: string;
}

const Select = forwardRef(
  (
    { id, label, options, error, errorMessage, ...rest }: SelectProps,
    ref: ForwardedRef<HTMLSelectElement>,
  ) => {
    const selectBorderStyle = error
      ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600';

    return (
      <div className="w-full space-y-0.5">
        <label
          htmlFor={id}
          className="block mb-2 ml-1 text-xs font-medium text-gray-600"
        >
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          name={id}
          className={classNames(
            selectBorderStyle,
            'mt-1 block w-full rounded-md border bg-white px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 outline-none focus:ring-inset sm:text-sm sm:leading-6 ',
          )}
          {...rest}
        >
          <option value="">-</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {errorMessage && (
          <span className="ml-1 text-sm font-medium text-red-500">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

export default Select;
