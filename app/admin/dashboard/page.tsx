'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getMessages } from '@/services/firebase';
import {
  FolderKanban,
  Users,
  MessageSquare,
  UserCog,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

// Mock data for the line chart
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Projects',
      data: [2, 3, 5, 4, 6, 7, 5, 8, 9, 7, 10, 12],
      borderColor: '#1F4B8F',
      backgroundColor: 'rgba(31, 75, 143, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#1F4B8F',
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
      display: false,
    },
    title: {
      display: false,
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
        stepSize: 2,
      },
      beginAtZero: true,
    },
  },
};

// Mock data for the doughnut chart
const doughnutChartData = {
  labels: ['Web', 'Mobile', 'ERP', 'Design'],
  datasets: [
    {
      data: [35, 25, 20, 20],
      backgroundColor: ['#1F4B8F', '#2F6EDB', '#60A5FA', '#E8EEF9'],
      borderColor: ['#1F4B8F', '#2F6EDB', '#60A5FA', '#E8EEF9'],
      borderWidth: 2,
      hoverOffset: 4,
    },
  ],
};

const doughnutChartOptions = {
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

// Loading skeleton for table
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function formatDate(timestamp: { seconds: number; nanoseconds: number } | undefined) {
  if (!timestamp) return '-';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const {
    data: messages,
    isLoading: messagesLoading,
  } = useQuery({
    queryKey: ['messages'],
    queryFn: getMessages,
  });

  const recentMessages = messages?.slice(0, 5) ?? [];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F4B8F]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your website statistics
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart - Project Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Doughnut Chart - Projects by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Projects by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messagesLoading ? (
            <TableSkeleton />
          ) : recentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <MessageSquare className="mb-3 h-10 w-10" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMessages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="font-medium">{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {msg.message}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(msg.createdAt as unknown as { seconds: number; nanoseconds: number })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
