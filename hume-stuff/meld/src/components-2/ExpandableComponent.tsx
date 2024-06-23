import React, { useEffect } from 'react';
import './ExpandableComponent.css';

interface ExpandableComponentProps {
  isExpanded: boolean;
}

const ExpandableComponent: React.FC<ExpandableComponentProps> = ({ isExpanded }) => {
  useEffect(() => {
    if (isExpanded) {
      document.querySelector('.container')?.classList.add('fade-out');
    }
  }, [isExpanded]);

  return (
    <div className={`expandable-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="expandable-content">
        <h2>Expandable Component</h2>
        <p>{isExpanded ? "Expanded!" : "Click to expand"}</p>
      </div>
    </div>
  );
};

export default ExpandableComponent;
