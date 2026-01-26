import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ProjectService } from '../../services/project';
import { TaskService } from '../../services/task';
import { UserStatsService } from '../../services/user-stats';
import { Project } from '../../types/project.type';
import { Task, TaskRequest, TaskStatus, ExpiredTask, isTaskCompleted } from '../../types/task.type';
import { DashboardLayout } from '../../components/dashboard-layout/dashboard-layout';
import { TaskItem } from '../../components/task-item/task-item';
import { TaskFormModal } from '../../components/task-form-modal/task-form-modal';
import { ExpiredTasksModal } from '../../components/expired-tasks-modal/expired-tasks-modal';
import { PriorityBadgeComponent } from '../../shared/components/priority-badge/priority-badge.component';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  bgColor: string;
  iconColor: string;
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayout,
    TaskItem,
    TaskFormModal,
    ExpiredTasksModal,
    PriorityBadgeComponent,
  ],
  templateUrl: './project-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  project: Project | null = null;
  tasks: Task[] = [];
  isLoading = true;
  isTaskModalOpen = false;
  selectedTask: Task | null = null;

  // Expired tasks
  isExpiredModalOpen = false;
  expiredTasks: ExpiredTask[] = [];
  expiredTasksCount = 0;
  isLoadingExpired = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly userStatsService: UserStatsService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get statCards(): StatCard[] {
    return [
      {
        label: 'Total Tasks',
        value: this.tasks.length,
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        bgColor: 'bg-neutral-800',
        iconColor: 'text-neutral-400'
      },
      {
        label: 'Completed',
        value: this.completedTasksCount,
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-emerald-500/10',
        iconColor: 'text-emerald-500'
      },
      {
        label: 'Pending',
        value: this.pendingTasks.length,
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-amber-500/10',
        iconColor: 'text-amber-500'
      },
      {
        label: 'Expired',
        value: this.expiredTasksCount,
        icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-red-500/10',
        iconColor: 'text-red-500'
      }
    ];
  }

  get completedTasksCount(): number {
    return this.tasks.filter(t => isTaskCompleted(t)).length;
  }

  get pendingTasks(): Task[] {
    return this.tasks.filter(t => !isTaskCompleted(t));
  }

  get completedTasksList(): Task[] {
    return this.tasks.filter(t => isTaskCompleted(t));
  }

  get progressPercentage(): number {
    return this.tasks.length > 0 
      ? Math.round((this.completedTasksCount / this.tasks.length) * 100)
      : 0;
  }

  get hasExpiredTasks(): boolean {
    return this.expiredTasksCount > 0;
  }

  loadProject(projectId: string): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.projectService.getProject(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (project: Project) => {
          this.project = project;
          this.loadTasks(projectId);
          this.loadExpiredTasksCount(projectId);
        },
        error: () => {
          this.toastr.error('Failed to load project');
          this.router.navigate(['/dashboard']);
        },
      });
  }

  loadTasks(projectId: string): void {
    this.taskService.getTasks(projectId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks;
        },
        error: () => {
          this.toastr.error('Failed to load tasks');
        },
      });
  }

  loadExpiredTasksCount(projectId: string): void {
    this.userStatsService.getExpiredTasksCount(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count: number) => {
          this.expiredTasksCount = count;
          this.cdr.markForCheck();
        },
        error: () => {
          this.expiredTasksCount = 0;
          this.cdr.markForCheck();
        },
      });
  }

  openCreateTaskModal(): void {
    this.selectedTask = null;
    this.isTaskModalOpen = true;
    this.cdr.markForCheck();
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = task;
    this.isTaskModalOpen = true;
    this.cdr.markForCheck();
  }

  closeTaskModal(): void {
    this.isTaskModalOpen = false;
    this.selectedTask = null;
    this.cdr.markForCheck();
  }

  openExpiredTasksModal(): void {
    if (!this.project) return;
    
    this.isExpiredModalOpen = true;
    this.isLoadingExpired = true;
    this.cdr.markForCheck();

    this.userStatsService.getExpiredTasksByProject(this.project.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingExpired = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (tasks: ExpiredTask[]) => {
          this.expiredTasks = tasks;
        },
        error: () => {
          this.toastr.error('Failed to load expired tasks');
        },
      });
  }

  closeExpiredTasksModal(): void {
    this.isExpiredModalOpen = false;
    this.expiredTasks = [];
    this.cdr.markForCheck();
  }

  onExpiredTaskClick(expiredTask: ExpiredTask): void {
    const task = this.tasks.find(t => t.id === expiredTask.id);
    if (task) {
      this.closeExpiredTasksModal();
      this.openEditTaskModal(task);
    }
  }

  saveTask(taskRequest: TaskRequest): void {
    if (!this.project) return;

    const operation$ = this.selectedTask
      ? this.taskService.updateTask(this.project.id, this.selectedTask.id, taskRequest)
      : this.taskService.createTask(this.project.id, taskRequest);

    operation$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (task: Task) => {
        if (this.selectedTask) {
          this.tasks = this.tasks.map(t => t.id === task.id ? task : t);
          this.toastr.success('Task updated successfully');
        } else {
          this.tasks = [task, ...this.tasks];
          this.toastr.success('Task created successfully');
        }
        this.updateProjectProgress();
        this.loadExpiredTasksCount(this.project!.id);
        this.closeTaskModal();
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error(`Failed to ${this.selectedTask ? 'update' : 'create'} task`);
      },
    });
  }

  onStatusChange(event: { task: Task; status: TaskStatus }): void {
    if (!this.project) return;

    this.taskService.updateTaskStatus(this.project.id, event.task.id, event.status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTask: Task) => {
          this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
          this.updateProjectProgress();
          this.loadExpiredTasksCount(this.project!.id);
          this.toastr.success('Task status updated');
          this.cdr.markForCheck();
        },
        error: () => {
          this.toastr.error('Failed to update task status');
        },
      });
  }

  deleteTask(task: Task): void {
    if (!this.project) return;

    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(this.project.id, task.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.tasks = this.tasks.filter(t => t.id !== task.id);
            this.updateProjectProgress();
            this.loadExpiredTasksCount(this.project!.id);
            this.toastr.success('Task deleted successfully');
            this.cdr.markForCheck();
          },
          error: () => {
            this.toastr.error('Failed to delete task');
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  }

  trackByStat(index: number, stat: StatCard): string {
    return stat.label;
  }

  trackByTask(index: number, task: Task): string {
    return task.id;
  }

  private updateProjectProgress(): void {
    if (this.project) {
      this.project = {
        ...this.project,
        totalTasks: this.tasks.length,
        completedTasks: this.completedTasksCount,
        progressPercentage: this.progressPercentage,
      };
    }
  }
}