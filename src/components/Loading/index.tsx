import './index.scss';

interface LoadingProps {
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ className }) => {
  return (
    <div className={`container ${className || ''}`}>
      <div className="loading">
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className="dot" />
        ))}
      </div>
    </div>
  );
};

export default Loading;