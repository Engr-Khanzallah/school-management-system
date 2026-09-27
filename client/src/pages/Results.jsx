import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Select, Input, Badge } from '../components/ui';
import { examService, studentService, resultService } from '../services';
import { useAuth } from '../context/AuthContext';

export default function Results() {
  const { user } = useAuth();
  const canManage = user.role === 'admin' || user.role === 'teacher';

  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [myReport, setMyReport] = useState(null);

  useEffect(() => {
    examService.list().then(setExams).catch(() => {});
  }, []);

  const activeExam = exams.find((e) => e._id === selectedExam);

  useEffect(() => {
    if (!canManage || !selectedExam || !activeExam) return;
    studentService.list({ class: activeExam.class?._id || activeExam.class }).then(setStudents).catch(() => {});
    resultService.byExam(selectedExam).then(setResults).catch(() => {});
  }, [selectedExam, canManage, activeExam]);

  const handleMarkChange = (studentId, subject, maxMarks, value) => {
    setMarksMap((prev) => {
      const studentMarks = prev[studentId] || [];
      const idx = studentMarks.findIndex((m) => m.subject === subject);
      const entry = { subject, marksObtained: Number(value) || 0, maxMarks };
      const updated = idx >= 0 ? studentMarks.map((m, i) => (i === idx ? entry : m)) : [...studentMarks, entry];
      return { ...prev, [studentId]: updated };
    });
  };

  const handleSaveResult = async (studentId) => {
    setError('');
    setSaving(true);
    try {
      await resultService.upsert({ exam: selectedExam, student: studentId, marks: marksMap[studentId] || [] });
      const updated = await resultService.byExam(selectedExam);
      setResults(updated);
    } catch (err) {
      setError(err.message || 'Could not save result.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await resultService.publish(selectedExam);
      alert('Results published — students can now view them.');
    } catch (err) {
      setError(err.message || 'Could not publish results.');
    }
  };

  // Student self-view
  useEffect(() => {
    if (canManage || !selectedExam || !user.profileRef) return;
    resultService
      .reportCard(user.profileRef, selectedExam)
      .then(setMyReport)
      .catch(() => setMyReport(null));
  }, [selectedExam, canManage, user.profileRef]);

  if (!canManage) {
    return (
      <Layout title="My Results">
        <Card className="mb-6">
          <Select
            label="Select exam"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            options={[{ value: '', label: 'Choose an exam' }, ...exams.map((ex) => ({ value: ex._id, label: ex.name }))]}
          />
        </Card>
        {myReport && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-navy-900">Report card</h2>
              <Badge tone={myReport.status === 'pass' ? 'success' : 'danger'}>{myReport.status}</Badge>
            </div>
            <Table
              columns={[
                { key: 'subject', header: 'Subject' },
                { key: 'marksObtained', header: 'Marks' },
                { key: 'maxMarks', header: 'Out of' },
              ]}
              rows={myReport.marks}
            />
            <div className="mt-4 flex gap-6 text-sm">
              <p>
                <span className="text-navy-500">Total: </span>
                {myReport.totalMarks} / {myReport.maxTotalMarks}
              </p>
              <p>
                <span className="text-navy-500">Percentage: </span>
                {myReport.percentage}%
              </p>
              <p>
                <span className="text-navy-500">Grade: </span>
                {myReport.grade}
              </p>
            </div>
          </Card>
        )}
      </Layout>
    );
  }

  return (
    <Layout title="Examinations & Results">
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-3 justify-between">
          <Select
            label="Select exam"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            options={[{ value: '', label: 'Choose an exam' }, ...exams.map((ex) => ({ value: ex._id, label: ex.name }))]}
          />
          {user.role === 'admin' && selectedExam && <Button onClick={handlePublish}>Publish results</Button>}
        </div>
      </Card>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {activeExam && students.length > 0 && (
        <Card className="mb-6">
          <h2 className="font-display text-lg text-navy-900 mb-4">Enter marks</h2>
          <div className="space-y-4">
            {students.map((s) => (
              <div key={s._id} className="border-b border-navy-50 pb-3 last:border-0">
                <p className="text-sm font-medium text-navy-800 mb-2">
                  {s.rollNo} — {s.name}
                </p>
                <div className="flex flex-wrap gap-3 items-end">
                  {(activeExam.subjects || []).map((subj) => (
                    <Input
                      key={subj.subject}
                      label={`${subj.subject} (/${subj.maxMarks})`}
                      type="number"
                      className="w-28"
                      min="0"
                      max={subj.maxMarks}
                      onChange={(e) => handleMarkChange(s._id, subj.subject, subj.maxMarks, e.target.value)}
                    />
                  ))}
                  <Button variant="secondary" onClick={() => handleSaveResult(s._id)} disabled={saving}>
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <h2 className="font-display text-lg text-navy-900 mb-4">Class results</h2>
          <Table
            columns={[
              { key: 'roll', header: 'Roll No.', render: (r) => r.student?.rollNo },
              { key: 'name', header: 'Name', render: (r) => r.student?.name },
              { key: 'totalMarks', header: 'Total' },
              { key: 'percentage', header: '%' },
              { key: 'grade', header: 'Grade' },
              { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'pass' ? 'success' : 'danger'}>{r.status}</Badge> },
            ]}
            rows={results}
          />
        </Card>
      )}
    </Layout>
  );
}
