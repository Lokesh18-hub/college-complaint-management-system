import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { staffService } from '../../services/staffService';
import { departmentService } from '../../services/departmentService';
import { Staff, Department } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const AdminStaffPage: React.FC = () => {
  const toast = useToast();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [staffRes, deptRes] = await Promise.all([
        staffService.getAll(selectedDeptFilter === 'ALL' ? undefined : selectedDeptFilter),
        departmentService.getAll(),
      ]);
      setStaffList(staffRes);
      setDepartments(deptRes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDeptFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDepartmentId(departments[0]?.id || '');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (staff: Staff) => {
    setCurrentStaff(staff);
    setName(staff.name);
    setEmail(staff.email);
    setPhone(staff.phone || '');
    setDepartmentId(staff.departmentId);
    setShowEditModal(true);
  };

  const handleOpenDelete = (staff: Staff) => {
    setCurrentStaff(staff);
    setShowDeleteModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !departmentId) return;
    try {
      setIsSubmitting(true);
      await staffService.create({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        departmentId,
      });
      toast.success('Staff member registered successfully!');
      setShowCreateModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff || !name.trim() || !email.trim() || !departmentId) return;
    try {
      setIsSubmitting(true);
      await staffService.update(currentStaff.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        departmentId,
      });
      toast.success('Staff details updated successfully!');
      setShowEditModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentStaff) return;
    try {
      setIsSubmitting(true);
      await staffService.delete(currentStaff.id);
      toast.success('Staff member removed successfully!');
      setShowDeleteModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete staff member');
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
            Staff Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage departmental technicians, engineers, wardens, and grievance resolution staff
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading staff directory..." />
        ) : staffList.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No staff found</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Add staff to enable grievance assignment.</p>
            <Button onClick={handleOpenCreate} size="sm">
              Add First Staff Member
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Active Tasks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <span className="text-[10px] text-slate-400">ID: {s.id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {s.department?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{s.email}</span>
                      </div>
                      {s.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{s.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {s._count?.complaints || 0} Complaints
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(s)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Staff Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Staff Member"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Ramesh Patil"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="ramesh.elec@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+91 91234 56789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Select
            label="Assigned Department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Add Staff Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Staff Member"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Select
            label="Assigned Department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>

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

      {/* Delete Staff Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Staff Member"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <p>
              Are you sure you want to remove <strong>{currentStaff?.name}</strong> from the staff directory?
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
              Confirm Removal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
