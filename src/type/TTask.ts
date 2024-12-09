import TaskDescEnum from '@/enum/TaskDescEnum';
import TaskStatusEnum from '@/enum/TaskStatusEnum';
import TaskTypeEnum from '@/enum/TaskTypeEnum';

export type TTask = {
  task_id: string;
  status: TaskStatusEnum;
  last_updated: string;
};

export type TTaskDetail = {
  id: string;
  reward_amount: number;
  name: string;
  description: TaskDescEnum;
  type: TaskTypeEnum;
};

export type TTaskData = {
  task: TTask;
  task_detail: TTaskDetail;
};
