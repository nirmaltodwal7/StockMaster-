export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', isLoading = false, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'glass-button',
    secondary: 'bg-accent text-accent-foreground hover:bg-slate-200 dark:hover:bg-slate-700',
    danger: 'bg-destructive text-destructive-foreground hover:bg-red-600',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || props.disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : children}
    </button>
  );
};
