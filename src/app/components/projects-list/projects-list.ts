import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCard } from '../project-card/project-card';
import { MetricCardComponent, MetricCardColor } from '../../shared/components/metric-card/metric-card.component';
import { TaskStatsCard } from '../task-stats-card/task-stats-card';
import { Project } from '../../types/project.type';
import { TaskStats } from '../../types/task.type';

export interface ProjectsListConfig {
  title: string;
  subtitle?: string;
  showSidebar?: boolean;
  showMetrics?: boolean;
  metrics?: Array<{
    value: number;
    label: string;
    icon: string;
    color: MetricCardColor;
  }>;
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCard,
    MetricCardComponent,
    TaskStatsCard,
  ],
  templateUrl: './projects-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent {
  @Input() projects: Project[] = [];
  @Input() isLoading = false;
  @Input() config: ProjectsListConfig = {
    title: 'Active Ecosystem',
    showSidebar: false,
    showMetrics: true,
  };
  @Input() taskStats?: TaskStats;
  @Input() isLoadingStats = false;
  @Input() showExpiredButton = false;
  @Input() expiredCount = 0;

  @Output() createProject = new EventEmitter<void>();
  @Output() editProject = new EventEmitter<Project>();
  @Output() deleteProject = new EventEmitter<Project>();
  @Output() openExpiredTasks = new EventEmitter<void>();

  get displayProjects(): Project[] {
    return this.projects;
  }

  onEdit(project: Project): void {
    this.editProject.emit(project);
  }

  onDelete(project: Project): void {
    this.deleteProject.emit(project);
  }

  onCreate(): void {
    this.createProject.emit();
  }

  onExpiredClick(): void {
    this.openExpiredTasks.emit();
  }
}
