import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Modal, Input, Select } from '../components/ui';
import { classService, teacherService } from '../services';
import { useAuth } from '../context/AuthContext';

export default function Classes() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModalFor, setAssignModalFor] = useState(null);
  const [form, setForm] = useState({ name: '', sections: '' });
  const [assignForm, setAssignForm] = useState({ subject: '', teacherId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([classService.list(), teacherService.list()])
      .then(([c, t]) => {
        setClasses(c);
        setTeachers(t);
      })
      .catch((err) => setError(err.message || 'Could not load classes.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await classService.create({
        name: form.name,
        sections: form.sections.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setModalOpen(false);
      setForm({ name: '', sections: '' });
      loadData();
    } catch (err) {
      setError(err.message || 'Could not create class.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this class?')) return;
    try {
      await classService.remove(id);
      loadData();
    } catch (err) {
      setError(err.message || 'Could not remove class.');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await classService.assignSubjectTeacher(assignModalFor._id, assignForm);
      setAssignModalFor(null);
      setAssignForm({ subject: '', teacherId: '' });
      loadData();
    } catch (err) {
      setError(err.message || 'Could not assign teacher.');
    }
  };

  const columns = [
    { key: 'name', header: 'Class' },
    { key: 'sections', header: 'Sections', render: (r) => (r.sections || []).join(', ') || '—' },
    {
      key: 'subjects',
      header: 'Subjects & teachers',
      render: (r) =>
        (r.subjects || []).length
          ? r.subjects.map((s) => `${s.name}${s.teacher?.name ? ` (${s.teacher.name})` : ''}`).join(', ')
          : '—',
    },
    ...(user.role === 'admin'
      ? [
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setAssignModalFor(r)}>
                  Assign subject
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
    <Layout title="Classes & Subjects">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-navy-600">{classes.length} class(es) configured</p>
        {user.role === 'admin' && <Button onClick={() => setModalOpen(true)}>Add class</Button>}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <Card>
        {loading ? (
          <p className="text-sm text-navy-400 py-8 text-center">Loading…</p>
        ) : (
          <Table columns={columns} rows={classes} emptyMessage="No classes created yet." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add class">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Class name" required placeholder="e.g. 10" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input
            label="Sections (comma separated)"
            placeholder="A, B, C"
            value={form.sections}
            onChange={(e) => setForm({ ...form, sections: e.target.value })}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            Add class
          </Button>
        </form>
      </Modal>

      <Modal open={!!assignModalFor} onClose={() => setAssignModalFor(null)} title={`Assign subject — Class ${assignModalFor?.name}`}>
        <form onSubmit={handleAssign} className="space-y-4">
          <Input
            label="Subject name"
            required
            placeholder="e.g. Mathematics"
            value={assignForm.subject}
            onChange={(e) => setAssignForm({ ...assignForm, subject: e.target.value })}
          />
          <Select
            label="Teacher"
            required
            value={assignForm.teacherId}
            onChange={(e) => setAssignForm({ ...assignForm, teacherId: e.target.value })}
            options={[{ value: '', label: 'Select teacher' }, ...teachers.map((t) => ({ value: t._id, label: t.name }))]}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            Assign
          </Button>
        </form>
      </Modal>
    </Layout>
  );
}
