import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Modal, Input, Select, Badge } from '../components/ui';
import { feeService, studentService } from '../services';
import { useAuth } from '../context/AuthContext';

const STATUS_TONE = { paid: 'success', pending: 'default', overdue: 'danger', partial: 'warning' };
const emptyForm = { student: '', feeType: 'tuition', amount: '', dueDate: '', academicYear: '' };

export default function Fees() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';

  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [payingFee, setPayingFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('cash');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    const params = isAdmin ? {} : { student: user.profileRef };
    Promise.all([feeService.list(params), isAdmin ? studentService.list() : Promise.resolve([])])
      .then(([f, s]) => {
        setFees(f);
        setStudents(s);
      })
      .catch((err) => setError(err.message || 'Could not load fee records.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await feeService.create(form);
      setModalOpen(false);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setError(err.message || 'Could not create fee record.');
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await feeService.pay(payingFee._id, { amountPaid: Number(payAmount), paymentMethod: payMethod });
      setPayingFee(null);
      setPayAmount('');
      loadData();
    } catch (err) {
      setError(err.message || 'Could not record payment.');
    }
  };

  const columns = [
    { key: 'student', header: 'Student', render: (r) => r.student?.name || 'You' },
    { key: 'feeType', header: 'Type', render: (r) => <span className="capitalize">{r.feeType}</span> },
    { key: 'amount', header: 'Amount', render: (r) => `$${r.amount}` },
    { key: 'amountPaid', header: 'Paid', render: (r) => `$${r.amountPaid || 0}` },
    { key: 'dueDate', header: 'Due', render: (r) => new Date(r.dueDate).toLocaleDateString() },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (r) =>
        isAdmin && r.status !== 'paid' ? (
          <Button variant="ghost" onClick={() => setPayingFee(r)}>
            Record payment
          </Button>
        ) : r.receiptNumber ? (
          <span className="text-xs text-navy-400">{r.receiptNumber}</span>
        ) : null,
    },
  ];

  return (
    <Layout title="Fee Management">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-navy-600">{fees.length} fee record(s)</p>
        {isAdmin && <Button onClick={() => setModalOpen(true)}>Add fee record</Button>}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <Card>
        {loading ? (
          <p className="text-sm text-navy-400 py-8 text-center">Loading…</p>
        ) : (
          <Table columns={columns} rows={fees} emptyMessage="No fee records yet." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add fee record">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Student"
            required
            value={form.student}
            onChange={(e) => setForm({ ...form, student: e.target.value })}
            options={[{ value: '', label: 'Select student' }, ...students.map((s) => ({ value: s._id, label: `${s.rollNo} — ${s.name}` }))]}
          />
          <Select
            label="Fee type"
            value={form.feeType}
            onChange={(e) => setForm({ ...form, feeType: e.target.value })}
            options={[
              { value: 'tuition', label: 'Tuition' },
              { value: 'transport', label: 'Transport' },
              { value: 'hostel', label: 'Hostel' },
              { value: 'exam', label: 'Exam' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Input label="Due date" type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <Input label="Academic year" placeholder="2026-2027" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            Add record
          </Button>
        </form>
      </Modal>

      <Modal open={!!payingFee} onClose={() => setPayingFee(null)} title="Record payment">
        <form onSubmit={handlePay} className="space-y-4">
          <p className="text-sm text-navy-600">
            Balance due: ${payingFee ? payingFee.amount - (payingFee.amountPaid || 0) : 0}
          </p>
          <Input label="Amount paid" type="number" required value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
          <Select
            label="Payment method"
            value={payMethod}
            onChange={(e) => setPayMethod(e.target.value)}
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Card' },
              { value: 'bank_transfer', label: 'Bank transfer' },
              { value: 'online', label: 'Online' },
              { value: 'cheque', label: 'Cheque' },
            ]}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            Record payment
          </Button>
        </form>
      </Modal>
    </Layout>
  );
}
