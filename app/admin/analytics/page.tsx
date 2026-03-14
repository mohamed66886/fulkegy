'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getEmployees } from '@/services/firebase';
import {
  FolderKanban,
  Users,
  MessageSquare,
  UserCog,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Stat card configuration
const statCards = [
  {
    key: 'totalProjects' as const,
    label: 'Total Projects',
    icon: FolderKanban,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    key: 'totalClients' as const,
    label: 'Total Clients',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    key: 'totalMessages' as const,
    label: 'Total Messages',
    icon: MessageSquare,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    key: 'totalEmployees' as const,
    label: 'Total Employees',
    icon: UserCog,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

// Mock monthly data for the bar chart
const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Registrations',
      data: [8, 12, 15, 10, 18, 22, 14, 20, 25, 19, 28, 32],
      backgroundColor: '#1F4B8F',
      borderRadius: 6,
    },
    {
      label: 'Projects',
      data: [2, 3, 5, 4, 6, 7, 5, 8, 9, 7, 10, 12],
      backgroundColor: '#2F6EDB',
      borderRadius: 6,
    },
    {
      label: 'Messages',
      data: [5, 8, 10, 7, 12, 15, 9, 14, 18, 13, 20, 24],
      backgroundColor: '#60A5FA',
      borderRadius: 6,
    },
  ],
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        color: '#374151',
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6B7280',
      },
    },
    y: {
      grid: {
        color: '#E8EEF9',
      },
      ticks: {
        color: '#6B7280',
        stepSize: 5,
      },
      beginAtZero: true,
    },
  },
};

// Mock data for message trends line chart
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Messages Received',
      data: [5, 8, 10, 7, 12, 15, 9, 14, 18, 13, 20, 24],
      borderColor: '#1F4B8F',
      backgroundColor: 'rgba(31, 75, 143, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#1F4B8F',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
    {
      label: 'Messages Replied',
      data: [3, 6, 8, 5, 9, 12, 7, 11, 15, 10, 17, 20],
      borderColor: '#2F6EDB',
      backgroundColor: 'rgba(47, 110, 219, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#2F6EDB',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
  ],
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        color: '#374151',
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6B7280',
      },
    },
    y: {
      grid: {
        color: '#E8EEF9',
      },
      ticks: {
        color: '#6B7280',
        stepSize: 5,
      },
      beginAtZero: true,
    },
  },
};

// Loading skeleton for stat cards
function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const {
    data: employees,
    isLoading: employeesLoading,
  } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  // Compute employee role distribution for pie chart
  const roleDistribution = employees
    ? employees.reduce(
        (acc, emp) => {
          acc[emp.role] = (acc[emp.role] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      )
    : {};

  const roleLabels = Object.keys(roleDistribution).map(
    (r) => r.charAt(0).toUpperCase() + r.slice(1)
  );
  const roleData = Object.values(roleDistribution);

  const pieChartData = {
    labels: roleLabels.length > 0 ? roleLabels : ['Admin', 'Developer', 'Designer', 'Manager'],
    datasets: [
      {
        data: roleData.length > 0 ? roleData : [2, 5, 3, 2],
        backgroundColor: ['#1F4B8F', '#2F6EDB', '#60A5FA', '#E8EEF9'],
        borderColor: ['#1F4B8F', '#2F6EDB', '#60A5FA', '#E8EEF9'],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#374151',
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F4B8F]">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your platform activity and performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.key}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {card.label}
                        </p>
                        <p className="mt-1 text-3xl font-bold text-gray-900">
                          {stats?.[card.key] ?? 0}
                        </p>
                      </div>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor}`}
                      >
                        <Icon className={`h-6 w-6 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Bar Chart - Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart & Line Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie Chart - Employee Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Roles Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {employeesLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1F4B8F] border-t-transparent" />
              </div>
            ) : (
              <div className="h-[300px]">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Line Chart - Message Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Message Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
