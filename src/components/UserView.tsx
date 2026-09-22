import React from 'react';
import { VisitorInfo } from '../types';
import { HomeSection } from './HomeSection';
import { MomentsSection } from './MomentsSection';
import { BiodataSection } from './BiodataSection';
import { GraduationSection } from './GraduationSection';
import { BeforeAfterSection } from './BeforeAfterSection';
import { VideoMomentsSection } from './VideoMomentsSection';
import { Footer } from './Footer';

interface UserViewProps {
  visitor: VisitorInfo | null;
}

export const UserView: React.FC<UserViewProps> = ({ visitor }) => {
  return (
    <div id="user-view" className="relative">
      {/* Main Single Page Sections */}
      <main className="relative">
        {/* 1. SECTION: HOME */}
        <HomeSection visitor={visitor} />

        {/* Section Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <hr className="border-t border-[#4B4038]/60" />
        </div>

        {/* 2. SECTION: MOMENTS */}
        <MomentsSection />

        {/* Section Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <hr className="border-t border-[#4B4038]/60" />
        </div>

        {/* 3. SECTION: BIODATA */}
        <BiodataSection />

        {/* Section Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <hr className="border-t border-[#4B4038]/60" />
        </div>

        {/* 4. SECTION: GRADUATION */}
        <GraduationSection />

        {/* Section Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <hr className="border-t border-[#4B4038]/60" />
        </div>

        {/* 5. SECTION: BEFORE-AFTER */}
        <BeforeAfterSection />

        {/* Section Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <hr className="border-t border-[#4B4038]/60" />
        </div>

        {/* 6. SECTION: VIDEO MOMENTS */}
        <VideoMomentsSection />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
