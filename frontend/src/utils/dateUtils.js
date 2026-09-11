// Returns a human label + urgency level for a given due date and status
export const getDeadlineInfo = (dueDate, status) => {
  if (status === 'Completed') {
    return { label: 'Completed', level: 'completed' };
  }

  const now = new Date();
  const due = new Date(dueDate);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffDays = Math.round((startOfDue - startOfToday) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Overdue', level: 'overdue' };
  if (diffDays === 0) return { label: 'Due Today', level: 'today' };
  if (diffDays === 1) return { label: 'Due Tomorrow', level: 'tomorrow' };
  if (diffDays <= 7) return { label: `Due in ${diffDays} days`, level: 'upcoming' };
  return { label: formatDate(dueDate), level: 'later' };
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const toInputDate = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

export const deadlineColors = {
  overdue: 'bg-red-50 text-red-600 border-red-200',
  today: 'bg-orange-50 text-orange-600 border-orange-200',
  tomorrow: 'bg-amber-50 text-amber-600 border-amber-200',
  upcoming: 'bg-blue-50 text-blue-600 border-blue-200',
  later: 'bg-gray-50 text-gray-500 border-gray-200',
  completed: 'bg-green-50 text-green-600 border-green-200',
};
