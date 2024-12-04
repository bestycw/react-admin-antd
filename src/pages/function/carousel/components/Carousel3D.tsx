import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Autoplay, Navigation } from 'swiper/modules';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// 引入 Swiper 样式
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

interface Carousel3DProps {
  items: Array<{
    title: string;
    imageUrl: string;
  }>;
}

const Carousel3D: React.FC<Carousel3DProps> = ({ items }) => {
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  // 处理点击事件
  const handleSlideClick = (index: number) => {
    if (!swiper) return;
    
    // 获取当前激活的slide索引
    const activeIndex = swiper.realIndex;
    // 计算需要滑动的距离
    const diff = index - activeIndex;
    
    if (diff > 0) {
      swiper.slideNext(300); // 向后滑动
    } else if (diff < 0) {
      swiper.slidePrev(300); // 向前滑动
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end items-center mb-4 space-x-4">
        <LeftOutlined className="cursor-pointer hover:text-blue-500 transition-colors swiper-button-prev" />
        <RightOutlined className="cursor-pointer hover:text-blue-500 transition-colors swiper-button-next" />
      </div>

      <div className="relative bg-gray-900 rounded-xl overflow-hidden">
        {/* 渐变遮罩 */}
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          loop={true}
          autoplay={isAutoplay ? {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          } : false}
          coverflowEffect={{
            rotate: 35,
            stretch: 0,
            depth: 100,
            modifier: 1.5,
            slideShadows: true
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          modules={[EffectCoverflow, Autoplay, Navigation]}
          className="h-[400px] w-full"
          onSwiper={setSwiper}
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          {items.map((item, index) => (
            <SwiperSlide 
              key={index} 
              className="bg-transparent cursor-pointer"
              onClick={() => handleSlideClick(index)}
            >
              <div className="relative w-full h-full group">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                  <h3 className="text-white text-xl font-bold">{item.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel3D; 