import TaskDescEnum from '@/enum/TaskDescEnum';
import TaskStatusEnum from '@/enum/TaskStatusEnum';
import useTask from '@/hooks/useTask';
import { IonIcon, IonSpinner } from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import React from 'react';

const TaskItemCard: React.FC<TTaskItemCard> = ({
  buttonText,
  taskName,
  iconUrl,
  taskDesc,
  taskId,
  taskStatus,
}) => {
  const { functionHandlerMap: taskHandlerMap, isLoading } = useTask();
  return (
    <div className="bg-primary-1 p-4 rounded-2xl flex items-center justify-between shadow-md">
      <div className="flex items-center">
        {iconUrl}
        <span className="text-left font-semibold">{taskName}</span>
      </div>
      {taskStatus == TaskStatusEnum.COMPLETE ? (
        <IonIcon icon={checkmarkOutline} size="large" color="success" />
      ) : (
        <button
          className="bg-[#1D97F1] text-white px-6 py-2 rounded-full font-semibold border border-solid border-[#7EC3F6] active:bg-blue-500"
          onClick={taskHandlerMap[taskDesc]?.(taskId)}>
          {isLoading ? (
            <IonSpinner name="crescent" className="text-sm" />
          ) : (
            buttonText
          )}
        </button>
      )}
    </div>
  );
};

type TTaskItemCard = {
  iconUrl: React.ReactElement;
  taskName: string;
  buttonText: string;
  taskDesc: TaskDescEnum;
  taskId: string;
  taskStatus: TaskStatusEnum;
};

export default TaskItemCard;
