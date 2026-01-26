import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priority, getPriorityInfo, PRIORITIES } from '../../../types/project.type';
import { TaskPriority, getTaskPriorityInfo, TASK_PRIORITIES } from '../../../types/task.type';

export type PriorityValue = Priority | TaskPriority;

interface PriorityStyle {
  dotColor: string;
  label: string;
}

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priority-badge.component.html',
})
export class PriorityBadgeComponent {
  @Input({ required: true }) priority!: PriorityValue;

  getPriorityStyle(): PriorityStyle {
    const priorityStr = this.priority as string;
    
    const projectPriority = PRIORITIES.find(p => p.value === priorityStr);
    if (projectPriority) {
      return this.createCleanStyle(projectPriority.iconColor || 'slate', projectPriority.label);
    }
    
    const taskPriority = TASK_PRIORITIES.find(p => p.value === priorityStr);
    if (taskPriority) {
      return this.createCleanStyle(taskPriority.iconColor || 'slate', taskPriority.label);
    }
    
    return this.createCleanStyle('slate', priorityStr);
  }

  private createCleanStyle(iconColorName: string, label: string): PriorityStyle {
    // Mapeamento de cores para as bolinhas
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-500',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      slate: 'bg-slate-500',
    };

    const dotColor = colorMap[iconColorName] || colorMap['slate'];

    return {
      dotColor,
      label,
    };
  }

  getDotColor(): string {
    return this.getPriorityStyle().dotColor;
  }

  getLabel(): string {
    return this.getPriorityStyle().label;
  }
}