import React from 'react';
import Masonry from 'react-masonry-css';
import { Card, Skeleton } from 'antd';
import { useInfiniteScroll } from 'ahooks';

interface Item {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  height: number;
}

interface LoadMoreResult {
  list: Item[];
  nextId: number | undefined;
}

const WaterfallPage: React.FC = () => {
  const loadMore = async (currentData?: LoadMoreResult): Promise<LoadMoreResult> => {
    const page = currentData ? (currentData.nextId || 0) : 0;
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const list = Array.from({ length: 10 }, (_, i) => ({
      id: page * 10 + i,
      title: `Item ${page * 10 + i}`,
      description: 'This is a sample description for the item',
      imageUrl: `https://picsum.photos/300/${200 + Math.floor(Math.random() * 200)}`,
      height: 200 + Math.floor(Math.random() * 200)
    }));

    return {
      list,
      nextId: page < 9 ? page + 1 : undefined
    };
  };

  const { data, loading } = useInfiniteScroll(loadMore);

  const breakpointColumns = {
    default: 4,
    1400: 3,
    1100: 2,
    700: 1
  };

  return (
    <div >
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-transparent"
      >
        {data?.list?.map((item) => (
          <Card
            key={item.id}
            hoverable
            cover={
              <img
                alt={item.title}
                src={item.imageUrl}
                className="w-full h-auto object-cover"
                style={{ minHeight: '200px' }}
              />
            }
            className="mb-4"
          >
            <Card.Meta
              title={item.title}
              description={item.description}
            />
          </Card>
        ))}
      </Masonry>
      
      {loading && (
        <div className="flex justify-center my-4">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      )}
    </div>
  );
};

export default WaterfallPage; 

export const routeConfig = {
  title: '瀑布布局',
  // icon: 'WaterOutlined',
  layout: true,
  auth: true,
}; 