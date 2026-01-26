import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardLayout } from '../../components/dashboard-layout/dashboard-layout';
import { ProductivityChart } from '../../components/productivity-chart/productivity-chart';
import { PriorityBadgeComponent } from '../../shared/components/priority-badge/priority-badge.component';
import { CalendarService } from '../../services/calendar';
import { CalendarTask, CalendarDay, getProjectTypeColor, getStatusColor } from '../../types/calendar.type';
import { getStatusInfo, TaskStatus } from '../../types/task.type';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DashboardLayout, ProductivityChart, PriorityBadgeComponent],
  templateUrl: './calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar implements OnInit {
  currentDate = new Date();
  selectedDate: Date | null = null;
  selectedTask: CalendarTask | null = null;
  calendarDays: CalendarDay[] = [];
  allTasks: CalendarTask[] = [];
  isLoading = true;
  
  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private readonly calendarService: CalendarService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.calendarService.getAllTasks().subscribe({
      next: (tasks: CalendarTask[]) => {
        this.allTasks = tasks;
        this.generateCalendar();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Failed to load tasks');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.calendarDays = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const daysFromPrevMonth = startingDayOfWeek;
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      this.calendarDays.push(this.createCalendarDay(date, false, today));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      this.calendarDays.push(this.createCalendarDay(date, true, today));
    }

    // Next month days (fill remaining cells to complete 6 rows)
    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push(this.createCalendarDay(date, false, today));
    }
  }

  private createCalendarDay(date: Date, isCurrentMonth: boolean, today: Date): CalendarDay {
    const dateStr = this.formatDateForComparison(date);
    const tasksForDay = this.allTasks.filter(task => task.endDate === dateStr);
    
    return {
      date,
      dayOfMonth: date.getDate(),
      isCurrentMonth,
      isToday: date.getTime() === today.getTime(),
      isSelected: this.selectedDate ? date.getTime() === this.selectedDate.getTime() : false,
      tasks: tasksForDay,
    };
  }

  private formatDateForComparison(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  selectDay(day: CalendarDay): void {
    this.selectedDate = day.date;
    this.calendarDays = this.calendarDays.map(d => ({
      ...d,
      isSelected: d.date.getTime() === day.date.getTime(),
    }));
    this.cdr.markForCheck();
  }

  get currentMonthName(): string {
    return this.months[this.currentDate.getMonth()];
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  get selectedDayTasks(): CalendarTask[] {
    if (!this.selectedDate) return [];
    const dateStr = this.formatDateForComparison(this.selectedDate);
    return this.allTasks.filter(task => task.endDate === dateStr);
  }

  get formattedSelectedDate(): string {
    if (!this.selectedDate) return '';
    return this.selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  navigateToProject(projectId: string): void {
    this.closeTaskDetail();
    this.router.navigate(['/project', projectId]);
  }

  openTaskDetail(task: CalendarTask, event: Event): void {
    event.stopPropagation();
    this.selectedTask = task;
    this.cdr.markForCheck();
  }

  closeTaskDetail(): void {
    this.selectedTask = null;
    this.cdr.markForCheck();
  }

  formatTaskDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getOverdueCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.allTasks.filter(task => {
      if (task.status === 'DONE') return false;
      const taskDate = new Date(task.endDate);
      return taskDate < today;
    }).length;
  }

  getProjectIcon(projectType: string): string {
    switch (projectType) {
      case 'WORK':
        return 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
      case 'PERSONAL':
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
      case 'STUDY':
      case 'SCHOOL':
        return 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z';
      default:
        return 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10';
    }
  }

  isTaskOverdue(task: CalendarTask): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.endDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today && task.status !== 'DONE';
  }

  isSelectedTaskOverdue(): boolean {
    if (!this.selectedTask) return false;
    return this.isTaskOverdue(this.selectedTask);
  }

  trackByDay(index: number, day: CalendarDay): string {
    return `${day.date.getTime()}-${day.dayOfMonth}`;
  }

  getTaskStatusInfo(status: TaskStatus) {
    return getStatusInfo(status);
  }
}
