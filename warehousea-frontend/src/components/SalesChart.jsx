import { Line } from 'react-chartjs-2';

const SalesChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [1200, 1900, 3000, 5000, 2300],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="chart-container" style={{ height: '400px', width: '800px' }}>
      <Line data={data} />
    </div>
  );
};

export default SalesChart;
