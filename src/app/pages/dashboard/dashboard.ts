import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardLayout } from '../../components/dashboard-layout/dashboard-layout';
import { ProjectFormModal } from '../../components/project-form-modal/project-form-modal';
import { ProjectsListComponent, ProjectsListConfig } from '../../components/projects-list/projects-list';
import { ExpiredTasksModal } from '../../components/expired-tasks-modal/expired-tasks-modal';
import { ProjectService } from '../../services/project';
import { UserStatsService } from '../../services/user-stats';
import { Project, ProjectRequest } from '../../types/project.type';
import { TaskStats, ExpiredTask } from '../../types/task.type';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayout,
    ProjectFormModal,
    ProjectsListComponent,
    ExpiredTasksModal,
  ],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  projects: Project[] = [];
  isModalOpen = false;
  selectedProject: Project | null = null;
  isLoading = true;
  readonly userName: string;
  readonly greeting: string;

  // Task Stats
  taskStats: TaskStats = {
    totalTasks: 0,
    todoCount: 0,
    planningCount: 0,
    inProgressCount: 0,
    doneCount: 0,
    missedCount: 0,
  };
  isLoadingStats = true;

  // Expired Tasks Modal
  isExpiredModalOpen = false;
  expiredTasks: ExpiredTask[] = [];
  isLoadingExpired = false;

  // Projects List Config
  projectsListConfig: ProjectsListConfig = {
    title: 'Active Ecosystem',
    showSidebar: true,
    showMetrics: true,
    metrics: [],
  };

  constructor(
    private readonly projectService: ProjectService,
    private readonly userStatsService: UserStatsService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.userName = sessionStorage.getItem('name') || 'User';
    this.greeting = this.computeGreeting();
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadTaskStats();
  }

  private computeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  loadProjects(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.updateMetrics();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Failed to load projects');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private updateMetrics(): void {
    this.projectsListConfig.metrics = [
      {
        value: this.projects.length,
        label: 'Total Workspace',
        icon: '<path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" stroke-width="2.5"/>',
        color: 'indigo',
      },
      {
        value: this.taskStats.totalTasks,
        label: 'Assignments Meta',
        icon: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/>',
        color: 'emerald',
      },
      {
        value: this.taskStats.inProgressCount,
        label: 'In-Flight Ops',
        icon: '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/>',
        color: 'amber',
      },
      {
        value: this.urgentProjectsCount,
        label: 'Critical Vectors',
        icon: '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16" stroke-width="2.5"/>',
        color: 'rose',
      },
    ];
  }

  loadTaskStats(): void {
    this.isLoadingStats = true;
    this.cdr.markForCheck();

    this.userStatsService.getTaskStats().subscribe({
      next: (stats: TaskStats) => {
        this.taskStats = stats;
        this.updateMetrics();
        this.isLoadingStats = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingStats = false;
        this.cdr.markForCheck();
      },
    });
  }

  openCreateModal(): void {
    this.selectedProject = null;
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  openEditModal(project: Project): void {
    this.selectedProject = project;
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProject = null;
    this.cdr.markForCheck();
  }

  openExpiredTasksModal(): void {
    this.isExpiredModalOpen = true;
    this.isLoadingExpired = true;
    this.cdr.markForCheck();

    this.userStatsService.getAllExpiredTasks().subscribe({
      next: (tasks: ExpiredTask[]) => {
        this.expiredTasks = tasks;
        this.isLoadingExpired = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Failed to load expired tasks');
        this.isLoadingExpired = false;
        this.cdr.markForCheck();
      },
    });
  }

  closeExpiredTasksModal(): void {
    this.isExpiredModalOpen = false;
    this.expiredTasks = [];
    this.cdr.markForCheck();
  }

  onExpiredTaskClick(task: ExpiredTask): void {
    this.closeExpiredTasksModal();
    this.router.navigate(['/project', task.projectId]);
  }

  saveProject(projectRequest: ProjectRequest): void {
    if (this.selectedProject) {
      this.projectService.updateProject(this.selectedProject.id, projectRequest).subscribe({
        next: (updatedProject: Project) => {
          const index = this.projects.findIndex(p => p.id === updatedProject.id);
          if (index !== -1) {
            this.projects = [
              ...this.projects.slice(0, index),
              updatedProject,
              ...this.projects.slice(index + 1)
            ];
          }
          this.toastr.success('Project updated successfully!');
          this.closeModal();
          this.cdr.markForCheck();
        },
        error: () => {
          this.toastr.error('Failed to update project');
        },
      });
    } else {
      this.projectService.createProject(projectRequest).subscribe({
        next: (newProject: Project) => {
          this.projects = [newProject, ...this.projects];
          this.toastr.success('Project created successfully!');
          this.closeModal();
          this.cdr.markForCheck();
        },
        error: () => {
          this.toastr.error('Failed to create project');
        },
      });
    }
  }

  deleteProject(project: Project): void {
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== project.id);
          this.updateMetrics();
          this.loadTaskStats();
          this.toastr.success('Project deleted successfully!');
          this.cdr.markForCheck();
        },
        error: () => {
          this.toastr.error('Failed to delete project');
        },
      });
    }
  }

  get urgentProjectsCount(): number {
    return this.projects.filter(p => p.priority === 'URGENT').length;
  }

  get completionPercentage(): number {
    if (this.taskStats.totalTasks === 0) {
      return 0;
    }
    return Math.round((this.taskStats.doneCount / this.taskStats.totalTasks) * 100);
  }
}
