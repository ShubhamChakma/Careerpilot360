import React from 'react';

export default function CareerPathStepper({ steps, isDark }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-[#6B6B6B] mb-2">Career Path</p>
      <div className="flex items-center gap-1 flex-wrap">
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <span className={`text-[10px] px-2.5 py-1 rounded-full border ${isDark ? 'border-[#3A3A3A] text-[#A8A8A8] bg-[#141414]' : 'border-[#D0D0D0] text-[#555] bg-[#F5F5F5]'}`}>
              {step}
            </span>
            {i < steps.length - 1 && <span className="text-[#3A3A3A] text-[10px]">→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}