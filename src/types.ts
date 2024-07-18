export interface IDesigner {
  id: number;
  username: string;
  avatar: string;
  email: string;
  issues: IDesignIssue[];
  medianTime?: number;
  totalTasksCompleted?: number;
  inProgressTasks?: number;
}

export interface IDesignIssue {
  id: number;
  key: string;
  date_created: string;
  date_started_by_designer: string | null;
  date_finished_by_designer: string | null;
  status: 'Done' | 'In Progress'  
}

export interface IProject {
  id: number;
  name: string;
  key: string;
}

// export interface IIssue {
//   key: string;
//   id: number;
//   status: string;
//   designer: string;
//   project: string;
//   date_created: string;
//   summary: string;
//   date_started_by_designer: string;
//   date_finished_by_designer: string;
// }

export interface IComment {
  id: number;
  issue: string;
  designer: {
    avatar: string;
    username: string;
  };
  date_created: string;
  message: string;
}

export interface ITask {
  id: number;
  status: 'Done' | 'New' | 'In Progress';
  designer: string | null;
  project: string;
  date_created: string;
  summary: string;
  received_from_client: number;
  send_to_project_manager: number;
  send_to_account_manager: number;
  send_to_designer: number;
  date_updated: string;
  date_started_by_designer: string | null;
  date_finished_by_designer: string | null;
  date_finished: string | null;
}
