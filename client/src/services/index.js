import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export const studentService = {
  list: (params) => api.get('/students', { params }).then((r) => r.data),
  get: (id) => api.get(`/students/${id}`).then((r) => r.data),
  create: (data) => api.post('/students', data).then((r) => r.data),
  update: (id, data) => api.put(`/students/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/students/${id}`).then((r) => r.data),
};

export const teacherService = {
  list: () => api.get('/teachers').then((r) => r.data),
  get: (id) => api.get(`/teachers/${id}`).then((r) => r.data),
  create: (data) => api.post('/teachers', data).then((r) => r.data),
  update: (id, data) => api.put(`/teachers/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/teachers/${id}`).then((r) => r.data),
};

export const classService = {
  list: () => api.get('/classes').then((r) => r.data),
  get: (id) => api.get(`/classes/${id}`).then((r) => r.data),
  create: (data) => api.post('/classes', data).then((r) => r.data),
  update: (id, data) => api.put(`/classes/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/classes/${id}`).then((r) => r.data),
  assignSubjectTeacher: (id, data) => api.post(`/classes/${id}/subjects`, data).then((r) => r.data),
};

export const attendanceService = {
  list: (params) => api.get('/attendance', { params }).then((r) => r.data),
  mark: (data) => api.post('/attendance', data).then((r) => r.data),
  update: (id, data) => api.put(`/attendance/${id}`, data).then((r) => r.data),
  percentage: (studentId) => api.get(`/attendance/percentage/${studentId}`).then((r) => r.data),
};

export const examService = {
  list: (params) => api.get('/exams', { params }).then((r) => r.data),
  get: (id) => api.get(`/exams/${id}`).then((r) => r.data),
  create: (data) => api.post('/exams', data).then((r) => r.data),
  update: (id, data) => api.put(`/exams/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/exams/${id}`).then((r) => r.data),
};

export const resultService = {
  upsert: (data) => api.post('/results', data).then((r) => r.data),
  byExam: (examId) => api.get(`/results/exam/${examId}`).then((r) => r.data),
  reportCard: (studentId, examId) => api.get(`/results/report-card/${studentId}/${examId}`).then((r) => r.data),
  publish: (examId) => api.patch(`/results/publish/${examId}`).then((r) => r.data),
};

export const feeService = {
  list: (params) => api.get('/fees', { params }).then((r) => r.data),
  create: (data) => api.post('/fees', data).then((r) => r.data),
  pay: (id, data) => api.post(`/fees/${id}/pay`, data).then((r) => r.data),
  update: (id, data) => api.put(`/fees/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/fees/${id}`).then((r) => r.data),
};

export const dashboardService = {
  stats: () => api.get('/dashboard/stats').then((r) => r.data),
};
