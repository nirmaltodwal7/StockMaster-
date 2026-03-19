import { forwardRef } from 'react';

export const Input = forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1 text-foreground/80">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full px-4 py-2 glass-input text-foreground placeholder-muted-foreground ${
          error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
