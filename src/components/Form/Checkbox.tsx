import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label: string;
}

const Checkbox = forwardRef(
  (
    { id, label, ...rest }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className="inline-flex items-center space-x-1.5">
        <input
          id={id}
          type="checkbox"
          value={id}
          ref={ref}
          className="cursor-pointer rounded border-gray-300 text-blue-600 transition focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
          {...rest}
        />
        <label
          htmlFor="private"
          className="truncate text-sm font-medium text-gray-500"
        >
          {label}
        </label>
      </div>
    );
  },
);

export default Checkbox;
