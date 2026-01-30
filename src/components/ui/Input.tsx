import { forwardRef } from 'react';

export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea';

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'className'
  > {
  /** Input type */
  type?: InputType;
  /** Value */
  value?: string | number;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Placeholder instead of label - hint text inside the field */
  placeholder?: string;
  /** Error message - when set, shows red border and message below the field */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Text direction: rtl or ltr */
  dir?: 'rtl' | 'ltr';
  /** Extra class for wrapper */
  className?: string;
  /** Extra class for input/textarea only */
  inputClassName?: string;
  /** For textarea only: number of rows */
  rows?: number;
  /** Ref for input/textarea */
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
}

const baseInputClass =
  'w-full px-4 py-3 rounded-xl border outline-none transition-all placeholder:text-gray-400 ' +
  'focus:ring-2 focus:ring-[#359C67]/20 focus:border-[#359C67] ' +
  'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200';

const errorInputClass = 'border-red-400 focus:border-red-500 focus:ring-red-200';
const normalInputClass = 'border-gray-200';

const Input = forwardRef<HTMLDivElement, InputProps>(function Input(
  {
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    dir,
    className = '',
    inputClassName = '',
    rows = 3,
    inputRef,
    ...rest
  },
  ref
) {
  const hasError = Boolean(error?.trim());
  const inputStyles = [
    baseInputClass,
    hasError ? errorInputClass : normalInputClass,
    inputClassName,
  ].join(' ');

  const commonProps = {
    value: value ?? '',
    onChange,
    placeholder,
    disabled,
    dir,
    className: inputStyles,
    'aria-invalid': hasError,
    'aria-describedby': hasError ? 'input-error' : undefined,
  };

  if (type === 'textarea') {
    return (
      <div ref={ref} className={`space-y-1 ${className}`.trim()}>
        <textarea
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...commonProps}
          rows={rows}
        />
        {hasError && (
          <p
            id="input-error"
            className="text-red-500 text-sm mt-1"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={`space-y-1 ${className}`.trim()}>
      <input
        ref={inputRef as React.Ref<HTMLInputElement>}
        type={type}
        {...rest}
        {...commonProps}
      />
      {hasError && (
        <p
          id="input-error"
          className="text-red-500 text-sm mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
