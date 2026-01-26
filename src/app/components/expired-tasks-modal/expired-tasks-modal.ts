import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiredTask, getStatusInfo } from '../../types/task.type';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-expired-tasks-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './expired-tasks-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpiredTasksModal {
  @Input() isOpen = false;
  @Input() tasks: ExpiredTask[] = [];
  @Input() projectName = '';
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() taskClick = new EventEmitter<ExpiredTask>();

  onClose(): void {
    this.close.emit();
  }

  onTaskClick(task: ExpiredTask): void {
    this.taskClick.emit(task);
  }

  getStatusClasses(status: ExpiredTask['status']): string {
    const info = getStatusInfo(status);
    return `${info.bgColor} ${info.textColor}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  getOverdueLabel(daysOverdue: number): string {
    if (daysOverdue === 1) return '1 day overdue';
    return `${daysOverdue} days overdue`;
  }

  trackByTaskId(_index: number, task: ExpiredTask): string {
    return task.id;
  }
}
