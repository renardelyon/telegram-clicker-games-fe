import React from 'react';

const AccountOutlet: React.FC<TAccountOutlet> = ({ children }) => {
  return (
    <div className="relative container h-screen w-screen">
      {/* Tab Buttons */}
      <div className="inline-block space-x-4 mt-10 mb-6 font-pixel text-sm">
        <button className="bg-gray-600 text-white px-6 py-2 rounded-full">
          REFERRALS
        </button>
        <button className="bg-green-500 text-white px-6 py-2 rounded-full">
          LANGUAGES
        </button>
      </div>
      {children}
    </div>
  );
};

type TAccountOutlet = {
  children: React.ReactNode;
};

export default AccountOutlet;
