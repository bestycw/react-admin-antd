import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

const CardStackCarousel: React.FC<{ items: any[] }> = ({ items }) => {
  return (
    <div className="flex justify-center">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        className="w-[300px] h-[400px]"
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        cardsEffect={{
          perSlideOffset: 8,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: true
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="rounded-lg overflow-hidden">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white text-lg font-bold">{item.title}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardStackCarousel; 