import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);
// import { Chart as ChartJS } from 'chart.js/auto';

const PieChart = ({ month }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchPieChartData();
  }, [month]);

  const fetchPieChartData = async () => {
    const response = await axios.get(
      'http://localhost:4800/api/transactions/piechart',
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
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
