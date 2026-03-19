export const Card = ({ children, className = '' }) => {
  return (
    <div className={`glass p-6 ${className}`}>
      {children}
    </div>
  );
};
