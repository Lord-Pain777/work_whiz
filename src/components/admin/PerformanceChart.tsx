import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { supabase } from '../../lib/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PerformanceChart: React.FC = () => {
  const [chartData, setChartData] = React.useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const { data: pointsHistory } = await supabase
          .from('points_history')
          .select('points, created_at, users(name)')
          .order('created_at', { ascending: true });

        if (!pointsHistory) return;

        const userPoints: Record<string, { points: number[]; dates: string[] }> = {};

        pointsHistory.forEach((record: any) => {
          const userName = record.users.name;
          const date = new Date(record.created_at).toLocaleDateString();
          
          if (!userPoints[userName]) {
            userPoints[userName] = { points: [], dates: [] };
          }
          
          userPoints[userName].points.push(record.points);
          userPoints[userName].dates.push(date);
        });

        const datasets = Object.entries(userPoints).map(([userName, data], index) => ({
          label: userName,
          data: data.points,
          borderColor: `hsl(${index * 60}, 70%, 50%)`,
          tension: 0.4,
        }));

        setChartData({
          labels: Object.values(userPoints)[0]?.dates || [],
          datasets,
        });
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
    );
  }

  return (
    <div className="p-4">
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Employee Performance Over Time',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Points Earned',
              },
            },
          },
        }}
      />
    </div>
  );
};