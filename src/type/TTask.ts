import TaskStatusEnum from '@/enum/TaskStatusEnum';

export type TTask = {
  task_id: string;
  status: TaskStatusEnum;
  last_updated: string;
};
