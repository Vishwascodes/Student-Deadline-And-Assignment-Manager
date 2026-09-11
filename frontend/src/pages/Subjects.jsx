import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiBookOpen } from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import SubjectCard from '../components/SubjectCard';
import SubjectForm from '../components/SubjectForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import subjectService from '../services/subjectService';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await subjectService.getSubjects();
      setSubjects(res.data);
    } catch (error) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openCreateForm = () => {
    setEditingSubject(null);
    setFormOpen(true);
  };

  const openEditForm = (subject) => {
    setEditingSubject(subject);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject._id, data);
        toast.success('Subject updated');
      } else {
        await subjectService.createSubject(data);
        toast.success('Subject added');
      }
      setFormOpen(false);
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await subjectService.deleteSubject(deleteTarget._id);
      toast.success('Subject deleted');
      setDeleteTarget(null);
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to delete subject');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
            <p className="mt-1 text-sm text-gray-500">Organize your assignments by subject</p>
          </div>
          <button onClick={openCreateForm} className="btn-primary">
            <FiPlus size={16} /> Add Subject
          </button>
        </div>

        {loading ? (
          <Loader size="lg" />
        ) : subjects.length === 0 ? (
          <EmptyState
            icon={FiBookOpen}
            title="No subjects yet"
            message="Add a subject to start organizing your assignments."
            actionLabel="Add Subject"
            onAction={openCreateForm}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map((s) => (
              <SubjectCard key={s._id} subject={s} onEdit={openEditForm} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>

      <SubjectForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSubject}
        isSubmitting={submitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Subject"
        message={`Deleting "${deleteTarget?.name}" will also delete all its assignments (${deleteTarget?.assignmentCount || 0}). This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
};

export default Subjects;
