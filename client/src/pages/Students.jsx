import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Modal, Input, Select } from '../components/ui';
import { studentService, classService } from '../services';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '',
  rollNo: '',
  class: '',
  section: '',
  dateOfBirth: '',
  parentName: '',
  parentContact: '',
  contactNumber: '',
};

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([studentService.list(), classService.list()])
      .then(([s, c]) => {
        setStudents(s);
        setClasses(c);
      })
      .catch((err) => setError(err.message || 'Could not load students.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditingId(student._id);
    setForm({
      name: student.name,
      rollNo: student.rollNo,
      class: student.class?._id || student.class,
      section: student.section,
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : '',
      parentName: student.parentName || '',
      parentContact: student.parentContact || '',
      contactNumber: student.contactNumber || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await studentService.update(editingId, form);
      } else {
        await studentService.create(form);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Could not save student.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this student record?')) return;
    try {
      await studentService.remove(id);
      loadData();
    } catch (err) {
      setError(err.message || 'Could not remove student.');
    }
  };

  const columns = [
    { key: 'rollNo', header: 'Roll No.' },
    { key: 'name', header: 'Name' },
    { key: 'class', header: 'Class', render: (r) => r.class?.name || '—' },
    { key: 'section', header: 'Section' },
    { key: 'parentContact', header: 'Parent contact', render: (r) => r.parentContact || '—' },
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
    <Layout title="Students">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-navy-600">{students.length} student(s) on record</p>
        {user.role === 'admin' && <Button onClick={openCreate}>Add student</Button>}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <Card>
        {loading ? (
          <p className="text-sm text-navy-400 py-8 text-center">Loading…</p>
        ) : (
          <Table columns={columns} rows={students} emptyMessage="No students added yet." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit student' : 'Add student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Roll number" required value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
            <Input label="Section" required value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
          </div>
          <Select
            label="Class"
            required
            value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value })}
            options={[{ value: '', label: 'Select class' }, ...classes.map((c) => ({ value: c._id, label: c.name }))]}
          />
          <Input
            label="Date of birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Parent name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
            <Input label="Parent contact" value={form.parentContact} onChange={(e) => setForm({ ...form, parentContact: e.target.value })} />
          </div>
          <Input label="Student contact" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            {editingId ? 'Save changes' : 'Add student'}
          </Button>
        </form>
      </Modal>
    </Layout>
  );
}
