import { ThemeContainer } from '@/components/ThemeContainer';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <ThemeContainer>
        <h1>Dashboard Content</h1>
        {/* 其他内容 */}
      </ThemeContainer>
      
      {/* 可以在同一个页面使用多个容器 */}
      <ThemeContainer className="dashboard-card">
        <div className="card-content">
          {/* 卡片内容 */}
        </div>
      </ThemeContainer>
    </div>
  );
};

export default Dashboard 