
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Project, ProjectType, getProjectTypeInfo } from '../../types/project.type';
import { PriorityBadgeComponent } from '../../shared/components/priority-badge/priority-badge.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, PriorityBadgeComponent],
  templateUrl: './project-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  @Input({ required: true }) project!: Project;
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  constructor(private readonly router: Router) {}

  getTypeLabel(type: ProjectType): string {
    return getProjectTypeInfo(type).label;
  }

  getTypeIcon(type: ProjectType): string {
    return getProjectTypeInfo(type).icon;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  getDaysRemaining(): number {
    const endDate = new Date(this.project.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get progressPercentage(): number {
    if (this.project.totalTasks === 0) return 0;
    return Math.round((this.project.completedTasks / this.project.totalTasks) * 100);
  }

  get isOverdue(): boolean {
    return this.getDaysRemaining() < 0;
  }

  get isDueSoon(): boolean {
    const days = this.getDaysRemaining();
    return days >= 0 && days <= 7;
  }

  get statusColor(): string {
    if (this.isOverdue) {
      return 'from-red-500/20 to-orange-500/20';
    } else if (this.isDueSoon) {
      return 'from-amber-500/20 to-orange-500/20';
    } else if (this.progressPercentage === 100) {
      return 'from-emerald-500/20 to-green-500/20';
    } else {
      return 'from-blue-500/20 to-violet-500/20';
    }
  }

  get timeRemainingLabel(): string {
    const days = this.getDaysRemaining();
    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} left`;
    } else if (days === 0) {
      return 'Due today';
    } else {
      return `${-days} day${-days === 1 ? '' : 's'} overdue`;
    }
  }

  get timeRemainingClass(): string {
    const days = this.getDaysRemaining();
    if (days < 0) {
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700/50';
    } else if (days <= 7) {
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/50';
    } else {
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700/50';
    }
  }

  navigateToProject(): void {
    this.router.navigate(['/project', this.project.id]);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.project);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.project);
  }
}
