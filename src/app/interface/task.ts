export class Task {
    id?: number;
    title: string = '';
    description: string = '';
    createdDate: Date = new Date();
    dueDate: string = '';
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' = 'PENDING';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  }
  