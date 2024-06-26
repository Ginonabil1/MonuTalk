import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { EffectCoverflow, Pagination } from 'swiper/modules';

const Scrollbar = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  useEffect(() => {
    axios.get("https://monu-talk-production.up.railway.app/artifacts")
      .then((res) => {
        setArtifacts(res.data);
      })
      .catch((err) => {
        console.log(err);
      }); 
  }, []);

  const handleClick = (artifact) => {
    setSelectedArtifact(selectedArtifact === artifact ? null : artifact);
  };

  return (
    <div className='corr'>
        <h1 id='title'>Artifacts</h1>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="swiper wow fadeInUp"
        data-wow-duration="1s" data-wow-delay="0.5s"
      >
        {artifacts.map((artifact) => (
          <SwiperSlide key={artifact.id} onClick={() => handleClick(artifact)}>
            <div className="slide-content">
              <img src={artifact.imageUrlList} alt={artifact.name} />
              {selectedArtifact !== artifact && (
                <div className="arrow-overlay">
                  <span>^</span>
                  <p>Details</p>
                </div>
              )}
              {selectedArtifact === artifact && (
                <div className="slide-overlay">
                  <h3>{artifact.name}</h3>
                  <p>{artifact.description}</p>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Scrollbar;
