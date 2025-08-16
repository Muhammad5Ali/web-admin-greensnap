import axios from 'axios';

// const API_BASE = 'http://localhost:3000/api/admin';
  //  const API_BASE = 'https://gs-admin.onrender.com/api/admin';
const API_BASE = import.meta.env.VITE_API_BASE + '/api/admin'

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const createSupervisor = async (supervisorData) => {
  try {
    const response = await api.post('/supervisors', supervisorData);
    return response.data;
  } catch (error) {
    console.error('Error creating supervisor:', error);
    throw error.response?.data?.message || 'Failed to create supervisor';
  }
};
// Add this function
export const deleteSupervisor = async (id) => {
  try {
    const response = await api.delete(`/supervisors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    throw error.response?.data?.message || 'Failed to delete supervisor';
  }
};

export const fetchReportStatusCounts = async () => {
  try {
    const response = await api.get('/report-status-counts');
    return {
      ...response.data,
      counts: {
        ...response.data.counts,
        outOfScope: response.data.counts.outOfScope || 0
      }
    };
  } catch (error) {
    console.error('Error fetching status counts:', error);
    throw error;
  }
};

export const fetchDashboardStats = async () => {
  try {
    const response = await api.get('/stats');
    return {
      ...response.data.stats,
      outOfScopeReports: response.data.stats.outOfScopeReports || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      outOfScopeReports: 0
    };
  }
};



export const fetchReports = async (status = '', page = 1, limit = 10, search = '') => {
  try {
    const response = await api.get('/reports', {  
      params: { status, page, limit, search }  // Correctly passing all parameters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const fetchReportDetails = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data.report;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw error;
  }
};

export const fetchSupervisors = async () => {
  try {
    const response = await api.get('/supervisors');
    return response.data.supervisors;
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    throw error;
  }
};

export const fetchSupervisorPerformance = async (id) => {
  const response = await api.get(`/supervisors/${id}/performance`);
  return response.data.stats;
};

export const fetchReportsOverview = async () => {
  try {
    const response = await api.get('/reports-overview');
    return response.data.data; // Changed from response.data.reports
  } catch (error) {
    console.error('Error fetching reports overview:', error);
    throw error;
  }
};
export const fetchUserActivity = async () => {
  try {
    const response = await api.get('/user-activity');
    return response.data.data; // Ensure we're accessing the correct property
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return []; // Return empty array instead of throwing error
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
//  Mark report as permanently resolved
export const markAsPermanentResolved = async (id) => {
  try {
    const response = await api.patch(`/reports/${id}/permanent-resolved`);
    return response.data;
  } catch (error) {
    console.error('Error marking as permanently resolved:', error);
    throw error.response?.data?.message || 'Failed to mark as permanently resolved';
  }
};
// Add rejection function
export const rejectReport = async (id, reason) => {
  try {
    const response = await api.post(`/reports/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting report:', error);
    throw error.response?.data?.message || 'Failed to reject report';
  }
};
export const assignReportsToSupervisor = async (supervisorId, reportIds, assignmentMessage) => {
  try {
    const response = await api.post('/reports/assign-to-supervisor', {
      supervisorId,
      reportIds,
      assignmentMessage
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning reports:', error);
    throw error.response?.data?.message || 'Failed to assign reports';
  }
};



// Workers
export const fetchWorkers = async (page = 1, limit = 20, search = '') => {
  try {
    const response = await api.get('/workers', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
};

export const createWorker = async (workerData) => {
  try {
    const response = await api.post('/workers', workerData);
    return response.data;
  } catch (error) {
    console.error('Error creating worker:', error);
    throw error.response?.data?.message || 'Failed to create worker';
  }
};

export const updateWorker = async (id, workerData) => {
  try {
    const response = await api.put(`/workers/${id}`, workerData);
    return response.data;
  } catch (error) {
    console.error('Error updating worker:', error);
    throw error.response?.data?.message || 'Failed to update worker';
  }
};

export const deleteWorker = async (id) => {
  try {
    const response = await api.delete(`/workers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting worker:', error);
    throw error.response?.data?.message || 'Failed to delete worker';
  }
};

// Attendance
export const fetchWorkerAttendance = async (workerId, dateFilter = {}) => {
  try {
    const response = await api.get(`/workers/${workerId}/attendance`, {
      params: dateFilter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching worker attendance:', error);
    throw error;
  }
};

export const fetchAnalyticsData = async () => {
  try {
    const [
      reportDistribution,
      supervisorPerformance,
      attendanceTrends,
      reportTrends
    ] = await Promise.all([
      api.get('/analytics/report-distribution'),
      api.get('/analytics/supervisor-performance'),
      api.get('/analytics/worker-attendance'),
      api.get('/analytics/report-trends')
    ]);

    return {
      reportDistribution: reportDistribution.data.distribution,
      supervisorPerformance: supervisorPerformance.data.performanceData,
      attendanceTrends: attendanceTrends.data.attendanceTrends,
      reportTrends: reportTrends.data.reportTrends
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw new Error('Failed to load analytics data');
  }
};