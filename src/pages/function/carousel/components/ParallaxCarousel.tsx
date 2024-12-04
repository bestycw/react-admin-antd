import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ParallaxCarousel: React.FC<{ items: any[] }> = ({ items }) => {
  return (
    <Swiper
      speed={600}
      parallax={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Parallax, Pagination, Navigation]}
      className="w-full h-[500px]"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          <div
            className="absolute left-0 top-0 w-full h-full"
            data-swiper-parallax="-23%"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="absolute left-0 top-0 w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 p-12 text-white">
            <h2 
              className="text-4xl font-bold" 
              data-swiper-parallax="-300"
              data-swiper-parallax-opacity="0"
              data-swiper-parallax-duration="600"
            >
              {item.title}
            </h2>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ParallaxCarousel; 