export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-accent/50 ${className}`}
    />
  );
};
