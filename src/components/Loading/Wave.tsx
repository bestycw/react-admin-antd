import './wave.scss';

const WaveLoading: React.FC = () => (
  <div className="wave-container">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="wave-bar" />
    ))}
  </div>
);

export default WaveLoading; 