import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  styleProps?: string;
  error?: boolean;
  errorMessage?: string;
}

const Input = forwardRef(
  (
    { label, styleProps, error, errorMessage, ...rest }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputBorderStyle = error
      ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600';

    return (
      <div>
        {!!label && (
          <label
            htmlFor={rest.id}
            className="block mb-2 ml-1 text-xs font-medium text-gray-600"
          >
            {label}
          </label>
        )}
        <input
          id={rest.id}
          ref={ref}
          className={`relative block w-full appearance-none rounded-md border-2
            px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm
            ${styleProps} ${inputBorderStyle}
          `}
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

export default Input;
