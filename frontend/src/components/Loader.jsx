const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-primary-200 border-t-primary-600`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm font-medium text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
};

export default Loader;
