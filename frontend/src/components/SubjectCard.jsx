import { FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  return (
    <div className="card group flex flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft animate-fadeIn">
      <div className="flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: subject.color }}
        >
          <FiBookOpen size={20} />
        </div>
        <span className="badge bg-gray-100 text-gray-600">
          {subject.assignmentCount} {subject.assignmentCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      <h3 className="truncate text-base font-semibold text-gray-900" title={subject.name}>
        {subject.name}
      </h3>
      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
        <button onClick={() => onEdit(subject)} className="btn-ghost flex-1 text-xs">
          <FiEdit2 size={14} /> Edit
        </button>
        <button onClick={() => onDelete(subject)} className="btn-ghost flex-1 !text-red-500 hover:!bg-red-50 text-xs">
          <FiTrash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
