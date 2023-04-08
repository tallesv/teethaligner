import classNames from '@/utils/bindClassNames';
import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const FileInput = forwardRef(
  (
    { label, error, errorMessage, ...rest }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    // console.log(error);
    const inputBorderStyle = error
      ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600';

    return (
      <div className="w-full space-y-0.5">
        {label && (
          <label
            htmlFor={rest.id}
            className="text-xs font-medium text-gray-500"
          >
            {label}
          </label>
        )}
        <input
          id={rest.id}
          ref={ref}
          type="file"
          className={classNames(
            inputBorderStyle,
            'block w-full cursor-pointer appearance-none rounded-md border-2 bg-white px-3 py-2 text-sm transition focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75',
          )}
          {...rest}
        />

        {errorMessage && (
          <span className="ml-1 text-sm font-medium text-red-500">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

export default FileInput;
