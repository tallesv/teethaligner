import classNames from '@/utils/bindClassNames';
import { ForwardedRef, forwardRef } from 'react';

interface RadioProps {
  id: string;
  label: string;
  error?: boolean;
}

const Radio = forwardRef(
  (
    { id, label, error, ...rest }: RadioProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputBorderStyle = error
      ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600';

    const labelStyle = error ? 'text-red-500' : 'text-gray-500';
    return (
      <div className="inline-flex items-center space-x-1.5">
        <input
          id={id}
          type="radio"
          name="deal"
          value={id}
          ref={ref}
          className={classNames(
            inputBorderStyle,
            'cursor-pointer rounded-full text-blue-600 transition disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75',
          )}
          {...rest}
        />
        <label
          htmlFor={id}
          className={classNames(
            labelStyle,
            'cursor-pointer truncate text-sm font-mediu',
          )}
        >
          {label}
        </label>
      </div>
    );
  },
);

export default Radio;
