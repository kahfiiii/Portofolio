"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-carbon" />,
});

export default function SplineScene() {
  return (
    <div className="w-full h-full flex items-center justify-center">
       <Spline 
         scene="https://prod.spline.design/mHGR0gYfOVzo5ItK/scene.splinecode" 
         className="w-full h-full"
       />
    </div>
  );
}
