import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../../shared/components/select/select.component';
import { PriorityBadgeComponent } from '../../shared/components/priority-badge/priority-badge.component';
import { Task, TaskPriority, TaskStatus, TASK_STATUSES, isTaskCompleted, getStatusInfo } from '../../types/task.type';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, SelectComponent, PriorityBadgeComponent],
  templateUrl: './task-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItem {
  @Input({ required: true }) task!: Task;
  @Output() statusChange = new EventEmitter<{ task: Task; status: TaskStatus }>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  statusOptions = TASK_STATUSES.map(s => ({ 
    value: s.value, 
    label: s.label, 
    bgColor: s.bgColor, 
    textColor: s.textColor,
    icon: s.icon,
    iconColor: s.iconColor
  }));

  get isCompleted(): boolean {
    return isTaskCompleted(this.task);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  }

  getDaysRemaining(): number {
    const endDate = new Date(this.task.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(): boolean {
    return !this.isCompleted && this.getDaysRemaining() < 0;
  }

  isDueSoon(): boolean {
    const days = this.getDaysRemaining();
    return !this.isCompleted && days >= 0 && days <= 2;
  }

  getDueDateText(): string {
    if (this.isCompleted) return 'Completed';
    
    const days = this.getDaysRemaining();
    if (days < 0) return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    if (days <= 2) return `${days} days left`;
    
    return this.formatDate(this.task.endDate);
  }

  onStatusChange(status: TaskStatus): void {
    if (status !== this.task.status) {
      this.statusChange.emit({ task: this.task, status });
    }
  }

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task);
  }
}