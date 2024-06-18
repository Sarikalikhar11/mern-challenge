import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  const fetchBarChartData = async () => {
    const response = await axios.get(
      'http://localhost:4800/api/transactions/barchart',
      {
        params: { month },
      }
    );
    setChartData(response.data);
  };

  const data = {
    labels: chartData.map((d) => d._id),
    datasets: [
      {
        label: 'Number of Items',
        data: chartData.map((d) => d.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return <Bar data={data} />;
};

export default BarChart;
