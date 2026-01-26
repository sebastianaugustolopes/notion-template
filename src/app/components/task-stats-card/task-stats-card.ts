
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStats, StatusStat, calculateStatusStats } from '../../types/task.type';

@Component({
  selector: 'app-task-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-stats-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatsCard {
  @Input({ required: true }) stats!: TaskStats;
  @Input() isLoading = false;

  private readonly CIRCLE_RADIUS = 50;
  private readonly STATUS_ICONS: Record<string, string> = {
    'backlog': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    'todo': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    'in-progress': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    'planning': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    'review': 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    'done': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'missed': 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };

  private readonly STATUS_ICON_COLORS: Record<string, string> = {
    'backlog': 'text-slate-600 dark:text-slate-400',
    'todo': 'text-slate-600 dark:text-slate-400',
    'in-progress': 'text-blue-600 dark:text-blue-400',
    'planning': 'text-purple-600 dark:text-purple-400',
    'review': 'text-purple-600 dark:text-purple-400',
    'done': 'text-emerald-600 dark:text-emerald-400',
    'missed': 'text-red-600 dark:text-red-400'
  };

  get statusStats(): StatusStat[] {
    return calculateStatusStats(this.stats);
  }

  get completionRate(): number {
    if (this.stats.totalTasks === 0) return 0;
    return Math.round((this.stats.doneCount / this.stats.totalTasks) * 100);
  }

  get circleCircumference(): number {
    return 2 * Math.PI * this.CIRCLE_RADIUS;
  }

  get circleOffset(): number {
    const progress = this.completionRate / 100;
    return this.circleCircumference * (1 - progress);
  }

  trackByStat(_index: number, stat: StatusStat): string {
    return stat.status;
  }

  getStatusIcon(status: string): string {
    const normalizedStatus = this.normalizeStatus(status);
    return this.STATUS_ICONS[normalizedStatus] || this.STATUS_ICONS['backlog'];
  }

  getStatusIconColor(status: string): string {
    const normalizedStatus = this.normalizeStatus(status);
    return this.STATUS_ICON_COLORS[normalizedStatus] || this.STATUS_ICON_COLORS['backlog'];
  }

  getProgressBarWidth(percentage: number): string {
    return `${Math.min(percentage, 100)}%`;
  }

  round(value: number): number {
    return Math.round(value);
  }

  private normalizeStatus(status: string): string {
    return status.toLowerCase().replace(/_/g, '-');
  }
}