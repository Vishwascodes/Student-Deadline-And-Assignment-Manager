import { FiEdit2, FiTrash2, FiCheckCircle, FiCalendar, FiBookOpen } from 'react-icons/fi';
import { PriorityBadge, StatusBadge, DeadlineBadge } from './Badges';
import { getDeadlineInfo, formatDate } from '../utils/dateUtils';

const AssignmentCard = ({ assignment, onEdit, onDelete, onComplete }) => {
  const deadline = getDeadlineInfo(assignment.dueDate, assignment.status);
  const isOverdue = deadline.level === 'overdue';

  return (
    <div
      className={`card group relative flex flex-col gap-3 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft animate-fadeIn ${
        isOverdue ? 'border-red-200' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: assignment.subject?.color || '#6366f1' }}
            />
            <span className="truncate text-xs font-medium text-gray-500">
              {assignment.subject?.name || 'No Subject'}
            </span>
          </div>
          <h3 className="truncate text-base font-semibold text-gray-900" title={assignment.title}>
            {assignment.title}
          </h3>
        </div>
        <PriorityBadge priority={assignment.priority} />
      </div>

      {assignment.description && (
        <p className="line-clamp-2 text-sm text-gray-500">{assignment.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={assignment.status} />
        <DeadlineBadge label={deadline.label} level={deadline.level} />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <FiCalendar size={13} />
        <span>Due {formatDate(assignment.dueDate)}</span>
      </div>

      <div className="mt-1 flex items-center gap-2 border-t border-gray-100 pt-3">
        {assignment.status !== 'Completed' && (
          <button
            onClick={() => onComplete(assignment)}
            className="btn-ghost flex-1 !text-green-600 hover:!bg-green-50 text-xs"
          >
            <FiCheckCircle size={14} /> Complete
          </button>
        )}
        <button onClick={() => onEdit(assignment)} className="btn-ghost flex-1 text-xs">
          <FiEdit2 size={14} /> Edit
        </button>
        <button
          onClick={() => onDelete(assignment)}
          className="btn-ghost flex-1 !text-red-500 hover:!bg-red-50 text-xs"
        >
          <FiTrash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
