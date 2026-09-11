const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center animate-fadeIn">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
