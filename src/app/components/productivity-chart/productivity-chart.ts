
import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CalendarTask } from '../../types/calendar.type';

Chart.register(...registerables);

export interface WeekDay {
  date: Date;
  label: string;
  shortLabel: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  efficiency: number;
}

@Component({
  selector: 'app-productivity-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productivity-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductivityChart implements AfterViewInit, OnChanges {
  @Input() tasks: CalendarTask[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private chartInitialized = false;
  currentWeekStart: Date = this.getWeekStart(new Date());
  weekDays: WeekDay[] = [];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.calculateWeekData();
    this.createChart();
    this.chartInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.calculateWeekData();
      if (this.chartInitialized) {
        this.updateChart();
      }
      this.cdr.markForCheck();
    }
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private formatDateForComparison(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateWeekData(): void {
    this.weekDays = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(date.getDate() + i);
      const dateStr = this.formatDateForComparison(date);

      const dayTasks = this.tasks.filter(t => t.endDate === dateStr);
      const completedTasks = dayTasks.filter(t => t.status === 'DONE').length;
      const efficiency = dayTasks.length > 0 ? Math.round((completedTasks / dayTasks.length) * 100) : 0;

      this.weekDays.push({
        date,
        label: dayNames[i],
        shortLabel: dayNames[i].substring(0, 3),
        totalTasks: dayTasks.length,
        completedTasks,
        pendingTasks: dayTasks.length - completedTasks,
        efficiency
      });
    }
  }

  get weekRangeLabel(): string {
    const endDate = new Date(this.currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    
    const startMonth = this.currentWeekStart.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    
    return `${startMonth} ${this.currentWeekStart.getDate()} — ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  get averageEfficiency(): number {
    if (this.weekDays.length === 0) return 0;
    const totals = this.weekDays.reduce((acc, curr) => ({ 
      done: acc.done + curr.completedTasks, 
      total: acc.total + curr.totalTasks 
    }), { done: 0, total: 0 });
    return totals.total > 0 ? Math.round((totals.done / totals.total) * 100) : 0;
  }

  get weeklyStats(): { total: number; completed: number; pending: number } {
    return {
      total: this.weekDays.reduce((sum, d) => sum + d.totalTasks, 0),
      completed: this.weekDays.reduce((sum, d) => sum + d.completedTasks, 0),
      pending: this.weekDays.reduce((sum, d) => sum + d.pendingTasks, 0),
    };
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.calculateWeekData();
    this.updateChart();
    this.cdr.markForCheck();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.calculateWeekData();
    this.updateChart();
    this.cdr.markForCheck();
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Create Multi-Layer Gradients for Depth
    const efficiencyGradient = ctx.createLinearGradient(0, 50, 0, 400);
    efficiencyGradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    efficiencyGradient.addColorStop(0.5, 'rgba(79, 70, 229, 0.05)');
    efficiencyGradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    const volumeGradient = ctx.createLinearGradient(0, 50, 0, 400);
    volumeGradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
    volumeGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.weekDays.map(d => d.shortLabel),
        datasets: [
          {
            label: 'Efficiency Rate (%)',
            data: this.weekDays.map(d => d.efficiency),
            borderColor: '#4f46e5',
            borderWidth: 5,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#4f46e5',
            pointBorderWidth: 4,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 5,
            tension: 0.45,
            fill: true,
            backgroundColor: efficiencyGradient,
            yAxisID: 'yEfficiency'
          },
          {
            label: 'Completed Tasks',
            data: this.weekDays.map(d => d.completedTasks),
            borderColor: '#10b981',
            borderWidth: 3,
            borderDash: [8, 4],
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#10b981',
            pointBorderWidth: 2,
            pointRadius: 4,
            tension: 0.45,
            fill: true,
            backgroundColor: volumeGradient,
            yAxisID: 'yTasks'
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: { size: 14, weight: 900 },
            bodyFont: { size: 13, weight: 600 },
            padding: 20,
            cornerRadius: 24,
            displayColors: true,
            boxPadding: 8,
            caretSize: 8,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.dataset.label?.includes('Rate')) {
                  label += `${context.parsed.y}%`;
                } else {
                  label += context.parsed.y;
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { 
              display: true,
              color: 'rgba(203, 213, 225, 0.2)',
              drawTicks: false
            },
            border: { display: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 11, weight: 900 },
              padding: 15
            }
          },
          yTasks: {
            type: 'linear',
            position: 'left',
            display: false,
            beginAtZero: true,
            grid: { display: false }
          },
          yEfficiency: {
            type: 'linear',
            position: 'right',
            display: true,
            min: 0,
            max: 105,
            grid: { 
              color: 'rgba(203, 213, 225, 0.1)',
              lineWidth: 1
            },
            border: { display: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 10, weight: 800 },
              padding: 10,
              stepSize: 25,
              callback: (value) => value + '%'
            }
          }
        }
      },
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;
    this.chart.data.labels = this.weekDays.map(d => d.shortLabel);
    this.chart.data.datasets[0].data = this.weekDays.map(d => d.efficiency);
    this.chart.data.datasets[1].data = this.weekDays.map(d => d.completedTasks);
    this.chart.update('active');
  }
}
