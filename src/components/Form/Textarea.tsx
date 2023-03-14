import classNames from '@/utils/bindClassNames';
import { ForwardedRef, forwardRef, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  styleProps?: string;
  error?: boolean;
}

const TextArea = forwardRef(
  (
    { label, error, ...rest }: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const inputBorderStyle = error
      ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600';

    return (
      <div className="w-full space-y-1">
        <label htmlFor="basic" className="text-xs font-medium text-gray-500">
          {label}
        </label>
        <textarea
          id="basic"
          ref={ref}
          rows={6}
          className={classNames(
            inputBorderStyle,
            'block p-2.5 w-full rounded-md border-2 text-sm text-gray-900 border-gray-300 focus:border-blue-600 focus:ring-blue-600 focus:outline-none',
          )}
          {...rest}
        />
      </div>
    );
  },
);

export default TextArea;
