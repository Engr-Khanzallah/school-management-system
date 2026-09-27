import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Select, Input, Badge } from '../components/ui';
import { attendanceService, classService, studentService } from '../services';
import { useAuth } from '../context/AuthContext';

const STATUS_TONE = { present: 'success', late: 'warning', absent: 'danger', excused: 'default' };

export default function Attendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [history, setHistory] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const canMark = user.role === 'admin' || user.role === 'teacher';

  useEffect(() => {
    classService.list().then(setClasses).catch(() => {});
  }, []);

  useEffect(() => {
    if (!canMark) return;
    if (!selectedClass || !selectedSection) {
      setStudents([]);
      return;
    }
    studentService
      .list({ class: selectedClass, section: selectedSection })
      .then((data) => {
        setStudents(data);
        const map = {};
        data.forEach((s) => (map[s._id] = 'present'));
        setStatusMap(map);
      })
      .catch((err) => setError(err.message || 'Could not load students.'));
  }, [selectedClass, selectedSection, canMark]);

  useEffect(() => {
    if (canMark || !user.profileRef) return;
    attendanceService.percentage(user.profileRef).then(setPercentage).catch(() => {});
    attendanceService.list({ student: user.profileRef }).then(setHistory).catch(() => {});
  }, [canMark, user.profileRef]);

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const records = students.map((s) => ({
        student: s._id,
        class: selectedClass,
        section: selectedSection,
        date,
        status: statusMap[s._id] || 'present',
      }));
      await attendanceService.mark({ records, markedBy: user.profileRef });
      alert('Attendance saved.');
    } catch (err) {
      setError(err.message || 'Could not save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const activeClass = classes.find((c) => c._id === selectedClass);

  if (!canMark) {
    return (
      <Layout title="My Attendance">
        {percentage && (
          <Card className="mb-6">
            <p className="text-sm text-navy-600">Overall attendance</p>
            <p className="text-3xl font-display text-clay-500 mt-1">{percentage.percentage}%</p>
            <p className="text-xs text-navy-400 mt-1">
              {percentage.present} present · {percentage.absent} absent · {percentage.total} total days
            </p>
          </Card>
        )}
        <Card>
          <Table
            columns={[
              { key: 'date', header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
              { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
              { key: 'remarks', header: 'Remarks', render: (r) => r.remarks || '—' },
            ]}
            rows={history}
            emptyMessage="No attendance history yet."
          />
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Attendance">
      <Card className="mb-6">
        <div className="grid sm:grid-cols-3 gap-3">
          <Select
            label="Class"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection('');
            }}
            options={[{ value: '', label: 'Select class' }, ...classes.map((c) => ({ value: c._id, label: c.name }))]}
          />
          <Select
            label="Section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            options={[
              { value: '', label: 'Select section' },
              ...(activeClass?.sections || []).map((s) => ({ value: s, label: s })),
            ]}
          />
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </Card>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {students.length > 0 && (
        <Card>
          <div className="space-y-3 mb-4">
            {students.map((s) => (
              <div key={s._id} className="flex items-center justify-between gap-3 py-2 border-b border-navy-50 last:border-0">
                <span className="text-sm text-navy-800">
                  {s.rollNo} — {s.name}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {['present', 'absent', 'late', 'excused'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusMap({ ...statusMap, [s._id]: status })}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${
                        statusMap[s._id] === status
                          ? 'bg-navy-700 text-white border-navy-700'
                          : 'text-navy-600 border-navy-100 hover:bg-navy-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save attendance'}
          </Button>
        </Card>
      )}
    </Layout>
  );
}
