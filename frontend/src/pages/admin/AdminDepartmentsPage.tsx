import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import { Department } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const AdminDepartmentsPage: React.FC = () => {
  const toast = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentDept, setCurrentDept] = useState<Department | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenCreate = () => {
    setName('');
    setDescription('');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setCurrentDept(dept);
    setName(dept.name);
    setDescription(dept.description || '');
    setShowEditModal(true);
  };

  const handleOpenDelete = (dept: Department) => {
    setCurrentDept(dept);
    setShowDeleteModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setIsSubmitting(true);
      await departmentService.create({ name: name.trim(), description: description.trim() || undefined });
      toast.success('Department created successfully!');
      setShowCreateModal(false);
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDept || !name.trim()) return;
    try {
      setIsSubmitting(true);
      await departmentService.update(currentDept.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success('Department updated successfully!');
      setShowEditModal(false);
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentDept) return;
    try {
      setIsSubmitting(true);
      await departmentService.delete(currentDept.id);
      toast.success('Department deleted successfully!');
      setShowDeleteModal(false);
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Departments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage functional departments handling campus infrastructure, sanitation, and services
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Department
        </Button>
      </div>

      {/* Department Cards Grid */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading departments..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-5 flex flex-col justify-between hover:shadow-card transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit department"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(dept)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {dept.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {dept._count?.staff || 0} Staff
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  {dept._count?.complaints || 0} Complaints
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Department Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Campus Department"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Green Campus & Horticulture"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Description & Scope"
            placeholder="Specify responsibilities, campus areas covered, and services managed..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Department
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Department"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Description & Scope"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Department Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Department"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <p>
              Are you sure you want to delete <strong>{currentDept?.name}</strong>? If there are active complaints assigned, you must reassign them first.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={isSubmitting}
              onClick={handleDelete}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
