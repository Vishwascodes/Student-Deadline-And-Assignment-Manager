import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { toInputDate } from '../utils/dateUtils';

const AssignmentForm = ({ isOpen, onClose, onSubmit, subjects, initialData, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          subject: initialData.subject?._id || initialData.subject,
          description: initialData.description,
          dueDate: toInputDate(initialData.dueDate),
          priority: initialData.priority,
          status: initialData.status,
        });
      } else {
        reset({
          title: '',
          subject: subjects[0]?._id || '',
          description: '',
          dueDate: '',
          priority: 'Medium',
          status: 'Pending',
        });
      }
    }
  }, [isOpen, initialData, subjects, reset]);

  if (!isOpen) return null;

  const submitHandler = (data) => onSubmit(data);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {initialData ? 'Edit Assignment' : 'New Assignment'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Data Structures Assignment 3"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Subject</label>
            {subjects.length === 0 ? (
              <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                Please add a subject first before creating an assignment.
              </p>
            ) : (
              <select className="input-field" {...register('subject', { required: 'Subject is required' })}>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
            {errors.subject && <p className="error-text">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="label">Description (optional)</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              placeholder="Add any notes or details..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                className="input-field"
                {...register('dueDate', { required: 'Due date is required' })}
              />
              {errors.dueDate && <p className="error-text">{errors.dueDate.message}</p>}
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input-field" {...register('priority')}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select className="input-field" {...register('status')}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || subjects.length === 0} className="btn-primary">
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
