"use client";

import { useEffect, useState } from "react";

import { Button } from "@terra/ui/components/button";

const slides = [
  {
    id: 1,
    title: "From Your Farm to the World.",
    subtitle:
      "Tokenize your harvest, connect directly with buyers, and unlock the true value of your coffee.",
    buttonText: "Become a Producer",
    backgroundImage: "/coffee-farmer-hands-holding-fresh-coffee-cherries-.png",
    role: "producer",
  },
  {
    id: 2,
    title: "Traceability in Every Cup.",
    subtitle:
      "Offer your customers a unique story by serving coffee with a verifiable origin they can invest in.",
    buttonText: "Join the Network",
    backgroundImage: "/minimalist-clean-coffee-shop-counter-barista-prepa.png",
    role: "coffee-shop",
  },
  {
    id: 3,
    title: "Own a Piece of Your Coffee.",
    subtitle:
      "Turn your daily coffee into a meaningful investment. Support farmers directly and track the journey from bean to brew.",
    buttonText: "Start Exploring",
    backgroundImage: "/top-down-view-hands-holding-beautiful-latte-wooden.png",
    role: "consumer",
  },
];

export default function SinglePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-cycle through slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${slide.backgroundImage}')`,
            }}
          />

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold text-balance text-white sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-lg font-light text-pretty text-white/90 sm:text-xl lg:text-2xl">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-white px-8 py-3 text-lg font-medium text-black transition-all duration-300 hover:bg-white/90"
              >
                {slide.buttonText}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute top-1/2 left-8 z-20 flex -translate-y-1/2 flex-col space-y-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
