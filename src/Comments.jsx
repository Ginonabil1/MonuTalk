import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

import axios from 'axios';

import { Grid, Pagination } from 'swiper/modules';

const Comments = () => {

    const [reviews,setReview] = useState([]);

    useEffect(() => {
        axios.get("https://monu-talk-production.up.railway.app/reviews")
        .then((res) => {
            setReview(res.data);
        })
        .catch((err) => {
            console.log(err)
        });
    },[]);

    const renderStars = (rating) => {
      const stars = [];
      for (let i = 0; i < 5; i++) {
        if (i < rating) {
          stars.push(<span key={i} className="star filled">★</span>);
        } else {
          stars.push(<span key={i} className="star">★</span>);
        }
      }
      return stars;
    };

  return (
    <div className='comm'>
        <Swiper
        slidesPerView={3}
        grid={{
          rows: 2,
        }}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Grid, Pagination]}
        className="mySwiper"
      >
        {reviews.slice(30,53).map((review) => (
                    <SwiperSlide key={review.id}><div className="review-card">
                    <h4>{review.userName}</h4>
                    <div className='rate'>
                      <p>For {review.museumName}</p>
                      <div className="stars">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p id='comment'>{review.comment}</p>
                  </div></SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Comments