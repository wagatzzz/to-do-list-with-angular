import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Task } from '../../interface/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  taskObj: Task = new Task();
  taskArr: Task[] = [];
  filteredTasks: Task[] = [];
  addTaskValue: string = '';
  editTaskValue: string = '';

  taskDueDate: string = '';
  taskDueTime: string = '';
  dueDateTime: any;

  todayDate: string = '';
  selectedDate: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.resetTaskForm();
    this.todayDate = this.getTodayDate();
    this.selectedDate = this.todayDate;
    this.getAllTasks();
  }

  // Get today's date in 'YYYY-MM-DD' format
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Pad month with 0
    const day = ('0' + today.getDate()).slice(-2); // Pad day with 0
    return `${year}-${month}-${day}`;
  }

  // Fetch all tasks from the API
  getAllTasks(): void {
    this.apiService.getAllTask().subscribe(
      (res: Task[]) => {
        this.taskArr = res;
        this.filterTasksByDate(); // Filter tasks by selected date
      },
      err => {
        alert('Unable to get list of tasks');
      }
    );
  }

  // Filter tasks by the selected date
  filterTasksByDate(): void {
    this.filteredTasks = this.taskArr.filter(task => {
      const taskDueDate = task.dueDate ? task.dueDate.split('T')[0] : '';
      return taskDueDate === this.selectedDate; // Compare with selected date
    });
  }

  // Add a new task
  addTask(): void {
    if (!this.taskObj.title || !this.taskObj.title.trim()) {
      alert('Task title is required');
      return;
    }

    const dueDateTime = `${this.taskDueDate}T${this.taskDueTime}:00`; // Combine date and time
    this.taskObj.dueDate = dueDateTime;

    this.apiService.addTask(this.taskObj).subscribe(
      res => {
        this.ngOnInit(); // Reload tasks after adding
        this.resetTaskForm();
      },
      err => {
        alert(err);
      }
    );
  }

  // Edit an existing task
  editTask(): void {
    if (!this.taskObj.title || !this.taskObj.title.trim()) {
      alert('Task title is required');
      return;
    }

    this.apiService.editTask(this.taskObj).subscribe(
      res => {
        this.ngOnInit(); // Reload tasks after editing
      },
      err => {
        alert('Failed to update task');
      }
    );
  }

  // Delete a task
  deleteTask(etask: Task): void {
    this.apiService.deleteTask(etask).subscribe(
      res => {
        this.ngOnInit(); // Reload tasks after deleting
      },
      err => {
        alert('Failed to delete task');
      }
    );
  }

  // Toggle task status between 'PENDING' and 'COMPLETED' when the checkbox is changed
  toggleTaskStatus(task: Task): void {
    if (task.status === 'COMPLETED') {
      task.status = 'PENDING';
    } else {
      task.status = 'COMPLETED';
    }

    this.apiService.editTask(task).subscribe(
      res => {
        console.log('Task status updated successfully');
      },
      err => {
        console.error('Failed to update task status:', err);
      }
    );
  }

  // Call task for editing (populate fields with the selected task)
  call(etask: Task): void {
    this.taskObj = { ...etask }; // Create a copy of the task to avoid direct mutation
    this.editTaskValue = etask.title;
    if (etask.dueDate) {
      const [date, time] = etask.dueDate.split('T');
      this.taskDueDate = date;
      this.taskDueTime = time.slice(0, 5); // Remove seconds
    }
  }

  // Reset the task form
  resetTaskForm(): void {
    this.taskObj = new Task();
    this.addTaskValue = '';
    this.editTaskValue = '';
    this.taskDueDate = '';
    this.taskDueTime = '';
  }
}
