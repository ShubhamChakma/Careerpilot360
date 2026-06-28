import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function ResumeGate({ onProceedGeneric, isDark }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
      <div className={`metal-card rounded-2xl p-8 text-center max-w-md`}>
        <span className="text-4xl block mb-4">🔒</span>
        <h2 className={`font-display font-semibold text-lg mb-2 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
          Resume Customization Locked
        </h2>
        <p className={`text-sm mb-6 ${isDark ? 'text-[#6B6B6B]' : 'text-[#999]'}`}>
          To conduct a fully personalized mock interview based on your real experience and skills, please upload your resume in the ATS Scanner first.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/ats-scanner" className="btn-metal w-full text-center py-2.5 rounded-lg font-semibold text-sm">
            Go to ATS Scanner
          </Link>
          <Button variant="secondary" onClick={onProceedGeneric} className="w-full justify-center">
            Proceed with Generic Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
