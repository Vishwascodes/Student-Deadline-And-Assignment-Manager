export const PriorityBadge = ({ priority }) => {
  const styles = {
    High: 'bg-red-50 text-red-600',
    Medium: 'bg-amber-50 text-amber-600',
    Low: 'bg-green-50 text-green-600',
  };
  return <span className={`badge ${styles[priority] || styles.Medium}`}>{priority}</span>;
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-gray-100 text-gray-600',
    'In Progress': 'bg-blue-50 text-blue-600',
    Completed: 'bg-green-50 text-green-600',
  };
  return <span className={`badge ${styles[status] || styles.Pending}`}>{status}</span>;
};

export const DeadlineBadge = ({ label, level }) => {
  const styles = {
    overdue: 'bg-red-50 text-red-600 border border-red-200',
    today: 'bg-orange-50 text-orange-600 border border-orange-200',
    tomorrow: 'bg-amber-50 text-amber-600 border border-amber-200',
    upcoming: 'bg-blue-50 text-blue-600 border border-blue-200',
    later: 'bg-gray-50 text-gray-500 border border-gray-200',
    completed: 'bg-green-50 text-green-600 border border-green-200',
  };
  return <span className={`badge ${styles[level] || styles.later}`}>{label}</span>;
};
