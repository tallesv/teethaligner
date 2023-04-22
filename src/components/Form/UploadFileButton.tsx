import classNames from '@/utils/bindClassNames';
import {
  ChangeEvent,
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
} from 'react';

interface UploadFileButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  multiple?: boolean;
  error?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const UploadFileButton = forwardRef(
  (
    {
      label,
      multiple = false,
      error,
      onChange,
      ...rest
    }: UploadFileButtonProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputBorderStyle = error
      ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600';

    return (
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
      <label
        className={classNames(
          inputBorderStyle,
          'ml-3 cursor-pointer rounded-md border bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50',
        )}
      >
        <span className="">{label ?? 'Escolher arquivo'}</span>
        <input
          type="file"
          multiple={multiple}
          id={rest.id}
          ref={ref}
          className="hidden"
          {...rest}
          onChange={onChange}
        />
      </label>
    );
  },
);

export default UploadFileButton;
