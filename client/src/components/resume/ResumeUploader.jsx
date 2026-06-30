import React from 'react';

export default function ResumeUploader({ file, setFile, dragging, setDragging, isDark }) {
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const lowerName = f.name.toLowerCase();
    if (
      f.type === 'application/pdf' ||
      f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      f.type === 'application/msword' ||
      lowerName.endsWith('.pdf') ||
      lowerName.endsWith('.docx') ||
      lowerName.endsWith('.doc')
    ) {
      setFile(f);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all mb-6 ${
        dragging
          ? 'border-[#C0C0C0] bg-[#C0C0C0]/5'
          : isDark
          ? 'border-[#2A2A2A] hover:border-[#3A3A3A]'
          : 'border-[#D0D0D0] hover:border-[#A0A0A0]'
      }`}
    >
      {file ? (
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-[#1A1A1A]' : 'bg-[#F0F0F0]'} flex items-center justify-center`}>
            <span className="text-2xl">📄</span>
          </div>
          <p className={`text-sm font-medium ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>{file.name}</p>
          <button
            onClick={() => setFile(null)}
            className="text-xs text-[#6B6B6B] hover:text-red-400 transition-colors font-medium"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <p className="text-2xl mb-3">📎</p>
          <p className={`text-sm font-medium mb-1 ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>Drop your resume here</p>
          <p className={`text-xs ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>PDF, DOC, DOCX, max 5MB</p>
          <label className="mt-4 inline-block cursor-pointer">
            <span className="btn-metal text-xs px-4 py-2 rounded-lg">Browse files</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) setFile(f);
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}
