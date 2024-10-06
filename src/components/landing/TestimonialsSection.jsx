// src/components/landing/TestimonialsSection.jsx
import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
    {
        text: "This app saved me countless times! The step-by-step guidance is amazing.",
        author: "Sarah J.",
        role: "High School Student",
        rating: 5,
    },
    {
        text: "The best tutoring service with instant answers. Highly recommended!",
        author: "Michael L.",
        role: "College Freshman",
        rating: 5,
    },
    {
        text: "I've improved my grades significantly since using this app. It's a game-changer!",
        author: "Emily R.",
        role: "Graduate Student",
        rating: 4,
    },
];

const TestimonialCard = ({ text, author, role, rating }) => (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl">
        <div className="flex mb-4">
            {[...Array(rating)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
            ))}
        </div>
        <p className="text-gray-700 mb-4">"{text}"</p>
        <div>
            <h4 className="font-semibold">{author}</h4>
            <p className="text-sm text-gray-500">{role}</p>
        </div>
    </div>
);

const TestimonialsSection = () => {
    return (
        <section className="pt-20 py-12 px-4 md:px-20 bg-gradient-to-b bg-white">
            <div className="flex flex-col items-center justify-center mx-auto max-w-6xl">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
                    What Our Users Say
                </h2>
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
                <div className="md:hidden w-full">
                    <Swiper
                        className="w-full max-w-[300px]"
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <TestimonialCard {...testimonial} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
