import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const VerticalCarousel: React.FC<{ items: any[] }> = ({ items }) => {
  return (
    <Swiper
      direction={'vertical'}
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="h-[400px] w-full vertical-carousel"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-full">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <h3 className="text-white text-2xl font-bold vertical-slide-title">{item.title}</h3>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default VerticalCarousel; 