import { Component, Input, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {
  totalTasks = input.required<number>();
  completedTasks = input.required<number>();
  showLabel = input<boolean>(true);
  size = input<'sm' | 'md' | 'lg'>('md');

  readonly percentage = computed(() => {
    const total = this.totalTasks();
    const completed = this.completedTasks();
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  });

  readonly progressColor = computed(() => {
    return 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600';
  });

  readonly heightClass = computed(() => {
    const s = this.size();
    if (s === 'sm') return 'h-1.5';
    if (s === 'lg') return 'h-3';
    return 'h-2';
  });
}
