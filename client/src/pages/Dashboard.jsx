import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { StatCard, Card, Badge } from '../components/ui';
import { dashboardService } from '../services';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService
      .stats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Could not load dashboard stats.'));
  }, []);

  return (
    <Layout title="Dashboard">
      {error && (
        <Card className="mb-6 border-clay-500">
          <p className="text-sm text-navy-700">{error}</p>
        </Card>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total students" value={stats.totalStudents} />
            <StatCard label="Total teachers" value={stats.totalTeachers} />
            <StatCard label="Attendance today" value={`${stats.attendancePercentageToday}%`} accent />
            <StatCard
              label="Fees collected"
              value={`$${stats.feeCollection.totalCollected} / $${stats.feeCollection.totalDue}`}
            />
          </div>

          <Card>
            <h2 className="font-display text-lg text-navy-900 mb-4">Upcoming exams</h2>
            {stats.upcomingExams.length === 0 ? (
              <p className="text-sm text-navy-400">No upcoming exams scheduled.</p>
            ) : (
              <ul className="space-y-3">
                {stats.upcomingExams.map((exam) => (
                  <li key={exam._id} className="flex items-center justify-between text-sm">
                    <span className="text-navy-800">{exam.name}</span>
                    <Badge>{new Date(exam.startDate).toLocaleDateString()}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </Layout>
  );
}
