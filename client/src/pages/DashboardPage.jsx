import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import StatsCards from '../components/dashboard/StatsCards';
import ConversionChart from '../components/dashboard/ConversionChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import dashboardService from '../services/dashboardService';
import requestService from '../services/requestService';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, chartDataRes, requestsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getChartData(),
        requestService.getRequests({ limit: 8, page: 1 }),
      ]);
      setStats(statsData);
      setChartData(chartDataRes);
      setRecentRequests(requestsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Overview"
        actions={
          <button className="btn btn-secondary btn-sm" onClick={load} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />
      <PageContainer>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>
        )}

        {/* Stats */}
        <section style={{ marginBottom: 24 }}>
          <StatsCards stats={stats} loading={loading} />
        </section>

        {/* Chart + Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Leads by Status</h2>
            </div>
            <div className="card-body" style={{ paddingTop: 12 }}>
              <ConversionChart data={chartData} loading={loading} />
            </div>
          </div>

          {/* Recent */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Requests</h2>
            </div>
            <div className="card-body" style={{ paddingTop: 0, paddingBottom: 0 }}>
              <RecentActivity requests={recentRequests} loading={loading} />
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
