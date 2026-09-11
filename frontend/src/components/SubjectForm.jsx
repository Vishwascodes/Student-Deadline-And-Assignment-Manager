import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
];

const SubjectForm = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const selectedColor = watch('color');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({ name: initialData.name, color: initialData.color });
      } else {
        reset({ name: '', color: COLOR_OPTIONS[0] });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{initialData ? 'Edit Subject' : 'New Subject'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Subject Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Data Structures"
              {...register('name', { required: 'Subject name is required' })}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setValue('color', color)}
                  className={`h-8 w-8 rounded-full transition-all duration-150 ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input type="hidden" {...register('color')} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
