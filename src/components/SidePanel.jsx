import React from 'react';
import logo from '../assets/logo.svg';
const SidePanel = ({ currentSlide, slides }) => {
  const slide = slides[currentSlide]; // Get current slide data
console.log(slide);
  return (
    <div className="flex flex-col justify-between items-center h-screen p-6 text-white">
      {/* Logo */}
      <div className="bg-white p-2 rounded-xl font-bold text-xl my-6">
        <img src={logo} alt="Logo" />
      </div>

      {/* Main Content */}
      <div className="">
        <h1 className="text-4xl font-semibold mb-4">{slide.title}</h1>
        <p className="text-base font-lat">{slide.description}</p>
      </div>

      {/* Footer Section (Unique to Each Slide) */}
      <div className="bg-[#0000001F] rounded-lg p-4  w-full mt-6">
        <img
          src={slide.image}
          alt={`${slide.footerTitle} Illustration`}
          className="max-h-20  mb-4"
        />
        <h2 className="text-lg font-bold">{slide.footerTitle}</h2>
        <p className="text-sm">{slide.footerDescription}</p>
      </div>

      {/* Slide Indicators */}
      <div className="flex gap-2 my-6">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SidePanel;
