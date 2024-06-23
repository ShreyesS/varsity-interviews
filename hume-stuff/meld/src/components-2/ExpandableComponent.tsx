import React, { useEffect, useState, useRef } from 'react';
import './ExpandableComponent.css';
import DonutChart from './DonutChart';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  RadialLinearScale
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  RadialLinearScale
);

const initialData = (label: string, color: string) => ({
  labels: [label],
  datasets: [{
    data: [100],
    backgroundColor: [color],
    hoverBackgroundColor: [color]
  }]
});

interface ExpandableComponentProps {
  isExpanded: boolean;
}

const ExpandableComponent: React.FC<ExpandableComponentProps> = ({ isExpanded }) => {
  const [data1, setData1] = useState(initialData('Category 1', '#3366CC'));
  const [data2, setData2] = useState(initialData('Category 2', '#3399FF'));
  const [data3, setData3] = useState(initialData('Category 3', '#33CCFF'));
  const [data4, setData4] = useState(initialData('Category 4', '#33FFFF'));

  useEffect(() => {
    if (isExpanded) {
      document.querySelector('.expandable-container')?.classList.add('expanded');
    } else {
      document.querySelector('.expandable-container')?.classList.remove('expanded');
    }
  }, [isExpanded]);

  return (
    <div className={`expandable-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="expandable-content">
        <h2>Expandable Component</h2>
        <div className="quadrants">
          <div className="quadrant">
            <DonutChart data={data1} title="Category 1" />
          </div>
          <div className="quadrant">
            <DonutChart data={data2} title="Category 2" />
          </div>
          <div className="quadrant">
            <DonutChart data={data3} title="Category 3" />
          </div>
          <div className="quadrant">
            <DonutChart data={data4} title="Category 4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandableComponent;
