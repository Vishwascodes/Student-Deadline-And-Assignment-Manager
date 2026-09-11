import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiFileText } from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import AssignmentCard from '../components/AssignmentCard';
import AssignmentForm from '../components/AssignmentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import assignmentService from '../services/assignmentService';
import subjectService from '../services/subjectService';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ subject: '', priority: '', status: '' });
  const [sortBy, setSortBy] = useState('newest');

  const [formOpen, setFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getSubjects();
      setSubjects(res.data);
    } catch (error) {
      toast.error('Failed to load subjects');
    }
  };

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sortBy };
      if (search) params.search = search;
      if (filters.subject) params.subject = filters.subject;
      if (filters.priority) params.priority = filters.priority;
      if (filters.status) params.status = filters.status;

      const res = await assignmentService.getAssignments(params);
      setAssignments(res.data);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [search, filters, sortBy]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => fetchAssignments(), 300);
    return () => clearTimeout(debounce);
  }, [fetchAssignments]);

  const openCreateForm = () => {
    if (subjects.length === 0) {
      toast.error('Please add a subject first');
      return;
    }
    setEditingAssignment(null);
    setFormOpen(true);
  };

  const openEditForm = (assignment) => {
    setEditingAssignment(assignment);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingAssignment) {
        await assignmentService.updateAssignment(editingAssignment._id, data);
        toast.success('Assignment updated');
      } else {
        await assignmentService.createAssignment(data);
        toast.success('Assignment created');
      }
      setFormOpen(false);
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (assignment) => {
    try {
      await assignmentService.markCompleted(assignment._id);
      toast.success('Marked as completed 🎉');
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to update assignment');
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await assignmentService.deleteAssignment(deleteTarget._id);
      toast.success('Assignment deleted');
      setDeleteTarget(null);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to delete assignment');
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilters = search || filters.subject || filters.priority || filters.status;

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and track all your academic tasks</p>
          </div>
          <button onClick={openCreateForm} className="btn-primary">
            <FiPlus size={16} /> New Assignment
          </button>
        </div>

        {/* Search & Filters */}
        <div className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="input-field sm:w-40"
            value={filters.subject}
            onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="input-field sm:w-36"
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            className="input-field sm:w-40"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select className="input-field sm:w-40" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* List */}
        {loading ? (
          <Loader size="lg" />
        ) : assignments.length === 0 ? (
          <EmptyState
            icon={FiFileText}
            title={hasActiveFilters ? 'No matching assignments' : 'No assignments yet'}
            message={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Create your first assignment to start tracking deadlines.'
            }
            actionLabel={!hasActiveFilters ? 'Create Assignment' : undefined}
            onAction={!hasActiveFilters ? openCreateForm : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assignments.map((a) => (
              <AssignmentCard
                key={a._id}
                assignment={a}
                onEdit={openEditForm}
                onDelete={setDeleteTarget}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>

      <AssignmentForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        subjects={subjects}
        initialData={editingAssignment}
        isSubmitting={submitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
};

export default Assignments;
