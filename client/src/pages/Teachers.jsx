import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Modal, Input } from '../components/ui';
import { teacherService } from '../services';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '',
  subjects: '',
  qualification: '',
  experienceYears: '',
  contactNumber: '',
};

export default function Teachers() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    teacherService
      .list()
      .then(setTeachers)
      .catch((err) => setError(err.message || 'Could not load teachers.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (teacher) => {
    setEditingId(teacher._id);
    setForm({
      name: teacher.name,
      subjects: (teacher.subjects || []).join(', '),
      qualification: teacher.qualification || '',
      experienceYears: teacher.experienceYears || '',
      contactNumber: teacher.contactNumber || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      subjects: form.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      experienceYears: Number(form.experienceYears) || 0,
    };
    try {
      if (editingId) {
        await teacherService.update(editingId, payload);
      } else {
        await teacherService.create(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Could not save teacher.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this teacher record?')) return;
    try {
      await teacherService.remove(id);
      loadData();
    } catch (err) {
      setError(err.message || 'Could not remove teacher.');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'subjects', header: 'Subjects', render: (r) => (r.subjects || []).join(', ') || '—' },
    { key: 'qualification', header: 'Qualification', render: (r) => r.qualification || '—' },
    { key: 'experienceYears', header: 'Experience', render: (r) => `${r.experienceYears || 0} yrs` },
    { key: 'contactNumber', header: 'Contact', render: (r) => r.contactNumber || '—' },
    ...(user.role === 'admin'
      ? [
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => openEdit(r)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(r._id)}>
                  Remove
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Layout title="Teachers">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-navy-600">{teachers.length} teacher(s) on record</p>
        {user.role === 'admin' && <Button onClick={openCreate}>Add teacher</Button>}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <Card>
        {loading ? (
          <p className="text-sm text-navy-400 py-8 text-center">Loading…</p>
        ) : (
          <Table columns={columns} rows={teachers} emptyMessage="No teachers added yet." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit teacher' : 'Add teacher'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input
            label="Subjects (comma separated)"
            value={form.subjects}
            onChange={(e) => setForm({ ...form, subjects: e.target.value })}
            placeholder="Mathematics, Physics"
          />
          <Input label="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Experience (years)"
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
            />
            <Input label="Contact number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            {editingId ? 'Save changes' : 'Add teacher'}
          </Button>
        </form>
      </Modal>
    </Layout>
  );
}
