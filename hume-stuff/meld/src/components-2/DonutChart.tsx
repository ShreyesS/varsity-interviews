import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './DonutChart.css';

interface DonutChartProps {
  data: any;
  title: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    const modifiedData = {
      ...data,
      datasets: data.datasets.map((dataset: any) => ({
        ...dataset,
        borderRadius: 10, // Rounded edges
        borderWidth: 2, // Adjust border width as needed
        rotation: -90, // Start rotation at top
        circumference: 360, // Full circle
      }))
    };
    setChartData(modifiedData);
  }, [data]);

  const options = {
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
    },
    rotation: -90, // Rotate the chart to start at the top
    circumference: 360, // Full circle
  };

  return (
    <div className="donut-chart-container">
      <div className="chart">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="chart-title">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default DonutChart;
