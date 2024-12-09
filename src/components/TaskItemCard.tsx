import React from 'react';

const TaskItemCard: React.FC<TTaskItemCard> = ({
  buttonText,
  taskName,
  iconUrl,
}) => {
  return (
    <div className="bg-primary-1 p-4 rounded-2xl flex items-center justify-between shadow-md">
      <div className="flex items-center">
        {iconUrl}
        <span className="text-left font-semibold">{taskName}</span>
      </div>
      <button
        data-twe-ripple-init
        className="bg-[#1D97F1] text-white px-6 py-2 rounded-full font-semibold border border-solid border-[#7EC3F6] active:bg-blue-500">
        {buttonText}
      </button>
    </div>
  );
};

type TTaskItemCard = {
  iconUrl: React.ReactElement;
  taskName: string;
  buttonText: string;
};

export default TaskItemCard;
