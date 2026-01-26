
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DashboardLayout } from '../../components/dashboard-layout/dashboard-layout';
import { ProjectFormModal } from '../../components/project-form-modal/project-form-modal';
import { ProjectsListComponent, ProjectsListConfig } from '../../components/projects-list/projects-list';
import { ProjectService } from '../../services/project';
import { Project, ProjectRequest } from '../../types/project.type';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayout,
    ProjectFormModal,
    ProjectsListComponent,
  ],
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects implements OnInit {

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isModalOpen = false;
  selectedProject: Project | null = null;
  isLoading = true;

  // Projects List Config
  projectsListConfig: ProjectsListConfig = {
    title: 'Active Ecosystem',
    showSidebar: false,
    showMetrics: true,
    metrics: [],
  };

  constructor(
    private readonly projectService: ProjectService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.filteredProjects = projects;
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
        value: this.completedProjectsCount,
        label: 'Completed',
        icon: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/>',
        color: 'emerald',
      },
      {
        value: this.inProgressProjectsCount,
        label: 'In Progress',
        icon: '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/>',
        color: 'amber',
      },
      {
        value: this.filteredProjects.length,
        label: 'Filtered Results',
        icon: '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16" stroke-width="2.5"/>',
        color: 'rose',
      },
    ];
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
            this.filteredProjects = this.projects;
            this.updateMetrics();
          }
          this.toastr.success('Project updated successfully');
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
          this.filteredProjects = this.projects;
          this.updateMetrics();
          this.toastr.success('Project created successfully');
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
          this.toastr.success('Project deleted successfully');
          this.projects = this.projects.filter(p => p.id !== project.id);
          this.filteredProjects = this.filteredProjects.filter(p => p.id !== project.id);
          this.updateMetrics();
          this.cdr.markForCheck();
        },
        error: () => {
          this.toastr.error('Failed to delete project');
        },
      });
    }
  }

  get completedProjectsCount(): number {
    return this.projects.filter(p => p.progressPercentage === 100).length;
  }

  get inProgressProjectsCount(): number {
    return this.projects.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length;
  }
}
