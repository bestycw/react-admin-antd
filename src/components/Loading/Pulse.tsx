import './pulse.scss';

const PulseLoading: React.FC = () => (
  <div className="pulse-container">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="pulse" />
    ))}
  </div>
);

export default PulseLoading; 