import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const StatusPieChart = ({ completed, pending, inProgress }) => {
  const data = {
    labels: ['Completed', 'Pending', 'In Progress'],
    datasets: [
      {
        data: [completed, pending, inProgress],
        backgroundColor: ['#10b981', '#94a3b8', '#3b82f6'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
      },
    },
  };

  return (
    <div style={{ height: '260px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export const PriorityBarChart = ({ priorityBreakdown }) => {
  const order = ['High', 'Medium', 'Low'];
  const counts = order.map(
    (p) => priorityBreakdown.find((item) => item._id === p)?.count || 0
  );

  const data = {
    labels: order,
    datasets: [
      {
        label: 'Assignments',
        data: counts,
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderRadius: 8,
        maxBarThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div style={{ height: '260px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};
