import { useGetTasks } from '@/api/task';
import TaskItemCard from '@/components/TaskItemCard';
import { TaskToIcon } from '@/constants/task';
import TaskTypeEnum from '@/enum/TaskTypeEnum';
import useBoundStore from '@/store/store';
import { TTaskData } from '@/type/TTask';
import errorHandler from '@/utils/error';
import { useEffect, useState } from 'react';

const TaskPage = () => {
  const {
    data: taskData,
    error: taskError,
    isError: taskIsError,
    isSuccess: taskIsSuccess,
  } = useGetTasks();

  const setErrorToast = useBoundStore.use.setErrorToast();
  const resetErrorToast = useBoundStore.use.resetErrorToast();

  const [taskDaily, setTaskDaily] = useState<TTaskData[]>([]);
  const [taskRecurrent, setTaskRecurrent] = useState<TTaskData[]>([]);
  const [taskOneTime, setTaskOneTime] = useState<TTaskData[]>([]);

  useEffect(() => {
    if (taskIsSuccess) {
      const taskDailyTemp: TTaskData[] = [];
      const taskRecurrentTemp: TTaskData[] = [];
      const taskOneTimeTemp: TTaskData[] = [];

      resetErrorToast();

      taskData.data.data?.forEach(val => {
        switch (val.task_detail.type) {
          case TaskTypeEnum.TASK_DAILY:
            taskDailyTemp.push(val);
            break;
          case TaskTypeEnum.TASK_ONE_TIME:
            taskOneTimeTemp.push(val);
            break;
          case TaskTypeEnum.RECURRENT_TASK:
            taskRecurrentTemp.push(val);
            break;
          default:
            errorHandler({
              error: new Error('Unknown Error'),
              axiosErrorHandlerFn: errMsg => {
                setErrorToast({ isOpen: true, message: errMsg || '' });
              },
              generalErrorHandlerFn: err => {
                setErrorToast({ isOpen: true, message: err.message || '' });
              },
            });
        }
      });

      setTaskDaily(taskDailyTemp);
      setTaskOneTime(taskOneTimeTemp);
      setTaskRecurrent(taskRecurrentTemp);
    }
    if (taskIsError) {
      errorHandler({
        error: taskError,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskData, taskError, taskIsError, taskIsSuccess]);

  return (
    <div id="task-page" className="min-h-screen bg-[#020D2F] text-white p-6">
      <div className="overflow-y-auto h-screen no-scrollbar">
        {/* Header Section */}
        <div className="text-center">
          <img
            src="/coins_animation.gif" // Replace with actual coin icon path
            alt="Coin"
            className="w-48 h-48 mx-auto"
          />
          <h1 className="text-2xl mt-4 font-pixel">EARN COINS</h1>
          <p className="text-lg mt-2">Claim coins everyday or finish tasks</p>
        </div>
        {/* Daily Rewards Section */}

        {taskDaily.map((val, index) => (
          <div
            key={index}
            className=" mt-4 p-[3px] rounded-2xl bg-gradient-to-r from-[#1D97F1] via-[#203A68] to-[#020D2F]">
            <TaskItemCard
              buttonText={val.task_detail.reward_amount.toLocaleString()}
              iconUrl={TaskToIcon[val.task_detail.description]}
              taskName={val.task_detail.name}
            />
          </div>
        ))}

        {/* Divider */}
        <div className="flex items-center mt-6">
          <hr className="flex-grow border-t" />
          <span className="px-4 font-semibold">⚡ Recurrent</span>
          <hr className="flex-grow border-t" />
        </div>

        {/* Tasks Section */}
        <div className="mt-4 space-y-4">
          {taskRecurrent.map((val, index) => (
            <TaskItemCard
              key={index}
              buttonText={val.task_detail.reward_amount.toLocaleString()}
              iconUrl={TaskToIcon[val.task_detail.description]}
              taskName={val.task_detail.name}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center mt-6">
          <hr className="flex-grow border-t" />
          <span className="px-4 font-semibold">⚡ One-Time</span>
          <hr className="flex-grow border-t" />
        </div>

        {/* Tasks Section */}
        <div className="pb-48 mt-4 space-y-4">
          {taskOneTime.map((val, index) => (
            <TaskItemCard
              key={index}
              buttonText={val.task_detail.reward_amount.toLocaleString()}
              iconUrl={TaskToIcon[val.task_detail.description]}
              taskName={val.task_detail.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
