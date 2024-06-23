import React, { useEffect, useState } from 'react';
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

const initialData = (label: string, color: string, value: number) => ({
  labels: [label],
  datasets: [{
    data: [value, 100 - value],
    backgroundColor: [color, '#f0f0f0'],
    hoverBackgroundColor: [color, '#f0f0f0']
  }]
});

interface ExpandableComponentProps {
  isExpanded: boolean;
  topEmotions: { emotion: string, score: number }[];
}

const ExpandableComponent: React.FC<ExpandableComponentProps> = ({ isExpanded, topEmotions }) => {
  const colors = ['#3366CC', '#3399FF', '#33CCFF', '#33FFFF'];
  const [data1, setData1] = useState(initialData('Category 1', '#3366CC', 100));
  const [data2, setData2] = useState(initialData('Category 2', '#3399FF', 100));
  const [data3, setData3] = useState(initialData('Category 3', '#33CCFF', 100));
  const [data4, setData4] = useState(initialData('Category 4', '#33FFFF', 100));

  useEffect(() => {
    if (isExpanded) {
      document.querySelector('.expandable-container')?.classList.add('expanded');
      if (topEmotions.length >= 4) {
        setData1(initialData(topEmotions[0].emotion, colors[0], topEmotions[0].score * 100));
        setData2(initialData(topEmotions[1].emotion, colors[1], topEmotions[1].score * 100));
        setData3(initialData(topEmotions[2].emotion, colors[2], topEmotions[2].score * 100));
        setData4(initialData(topEmotions[3].emotion, colors[3], topEmotions[3].score * 100));
      }
    } else {
      document.querySelector('.expandable-container')?.classList.remove('expanded');
    }
  }, [isExpanded, topEmotions]);

  return (
    <div className={`expandable-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="expandable-content">
        <h2>Your Top Emotions</h2>
        <div className="quadrants">
          <div className="quadrant">
            <DonutChart data={data1} title={topEmotions[0]?.emotion || 'Category 1'} />
          </div>
          <div className="quadrant">
            <DonutChart data={data2} title={topEmotions[1]?.emotion || 'Category 2'} />
          </div>
          <div className="quadrant">
            <DonutChart data={data3} title={topEmotions[2]?.emotion || 'Category 3'} />
          </div>
          <div className="quadrant">
            <DonutChart data={data4} title={topEmotions[3]?.emotion || 'Category 4'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandableComponent;
