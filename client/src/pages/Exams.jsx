import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Modal, Input, Select, Badge } from '../components/ui';
import { examService, classService } from '../services';
import { useAuth } from '../context/AuthContext';

const emptySubject = { subject: '', maxMarks: 100, passingMarks: 33 };

export default function Exams() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', class: '', startDate: '', endDate: '', subjects: [emptySubject] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([examService.list(), classService.list()])
      .then(([e, c]) => {
        setExams(e);
        setClasses(c);
      })
      .catch((err) => setError(err.message || 'Could not load exams.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const updateSubjectRow = (idx, key, value) => {
    const subjects = [...form.subjects];
    subjects[idx] = { ...subjects[idx], [key]: value };
    setForm({ ...form, subjects });
  };

  const addSubjectRow = () => setForm({ ...form, subjects: [...form.subjects, emptySubject] });
  const removeSubjectRow = (idx) => setForm({ ...form, subjects: form.subjects.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await examService.create(form);
      setModalOpen(false);
      setForm({ name: '', class: '', startDate: '', endDate: '', subjects: [emptySubject] });
      loadData();
    } catch (err) {
      setError(err.message || 'Could not create exam.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this exam?')) return;
    try {
      await examService.remove(id);
      loadData();
    } catch (err) {
      setError(err.message || 'Could not remove exam.');
    }
  };

  const columns = [
    { key: 'name', header: 'Exam' },
    { key: 'class', header: 'Class', render: (r) => r.class?.name || '—' },
    { key: 'subjects', header: 'Subjects', render: (r) => (r.subjects || []).map((s) => s.subject).join(', ') },
    { key: 'startDate', header: 'Starts', render: (r) => (r.startDate ? new Date(r.startDate).toLocaleDateString() : '—') },
    {
      key: 'resultsPublished',
      header: 'Results',
      render: (r) => <Badge tone={r.resultsPublished ? 'success' : 'default'}>{r.resultsPublished ? 'Published' : 'Pending'}</Badge>,
    },
    ...(user.role === 'admin'
      ? [
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <Button variant="ghost" onClick={() => handleDelete(r._id)}>
                Remove
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <Layout title="Examinations">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-navy-600">{exams.length} exam(s) scheduled</p>
        {user.role === 'admin' && <Button onClick={() => setModalOpen(true)}>Schedule exam</Button>}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <Card>
        {loading ? (
          <p className="text-sm text-navy-400 py-8 text-center">Loading…</p>
        ) : (
          <Table columns={columns} rows={exams} emptyMessage="No exams scheduled yet." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule exam">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Exam name" required placeholder="Mid-Term 2026" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select
            label="Class"
            required
            value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value })}
            options={[{ value: '', label: 'Select class' }, ...classes.map((c) => ({ value: c._id, label: c.name }))]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="End date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>

          <div>
            <p className="text-sm font-medium text-navy-700 mb-2">Subjects</p>
            <div className="space-y-2">
              {form.subjects.map((s, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <Input
                    label={idx === 0 ? 'Subject' : undefined}
                    placeholder="Subject"
                    value={s.subject}
                    onChange={(e) => updateSubjectRow(idx, 'subject', e.target.value)}
                  />
                  <Input
                    label={idx === 0 ? 'Max' : undefined}
                    type="number"
                    className="w-20"
                    value={s.maxMarks}
                    onChange={(e) => updateSubjectRow(idx, 'maxMarks', Number(e.target.value))}
                  />
                  <Input
                    label={idx === 0 ? 'Pass' : undefined}
                    type="number"
                    className="w-20"
                    value={s.passingMarks}
                    onChange={(e) => updateSubjectRow(idx, 'passingMarks', Number(e.target.value))}
                  />
                  {form.subjects.length > 1 && (
                    <Button type="button" variant="ghost" onClick={() => removeSubjectRow(idx)}>
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="secondary" className="mt-2" onClick={addSubjectRow}>
              + Add subject
            </Button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            Schedule exam
          </Button>
        </form>
      </Modal>
    </Layout>
  );
}
