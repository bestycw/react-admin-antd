import './circle.scss';

const CircleLoading: React.FC = () => (
  <div className="circle-container">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="circle" />
    ))}
  </div>
);

export default CircleLoading; 