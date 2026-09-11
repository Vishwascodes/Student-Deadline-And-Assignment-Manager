const colorMap = {
  indigo: 'bg-primary-50 text-primary-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
};

const StatCard = ({ icon: Icon, label, value, color = 'indigo', delay = 0 }) => {
  return (
    <div
      className="card flex items-center gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
