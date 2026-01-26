import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

export type MetricCardColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'dark';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './metric-card.component.html',
})
export class MetricCardComponent {
  @Input() value: string | number = 0;
  @Input() label = '';
  @Input() subLabel?: string;
  @Input() icon = '';
  @Input() backgroundIcon = '';
  @Input() color: MetricCardColor = 'indigo';
  @Input() showBackgroundIcon = true;
  @Input() variant: 'default' | 'compact' = 'default';

  get colorClasses(): string {
    const colors: Record<MetricCardColor, { shadow: string; iconBg: string; iconText: string; iconBorder: string }> = {
      indigo: {
        shadow: 'shadow-indigo-500/5',
        iconBg: 'bg-indigo-50 dark:bg-indigo-900/30',
        iconText: 'text-indigo-600',
        iconBorder: 'border-indigo-100 dark:border-indigo-800',
      },
      emerald: {
        shadow: 'shadow-emerald-500/5',
        iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
        iconText: 'text-emerald-600',
        iconBorder: 'border-emerald-100 dark:border-emerald-800',
      },
      amber: {
        shadow: 'shadow-amber-500/5',
        iconBg: 'bg-amber-50 dark:bg-amber-900/30',
        iconText: 'text-amber-600',
        iconBorder: 'border-amber-100 dark:border-amber-800',
      },
      rose: {
        shadow: 'shadow-rose-500/5',
        iconBg: 'bg-rose-50 dark:bg-rose-900/30',
        iconText: 'text-rose-600',
        iconBorder: 'border-rose-100 dark:border-rose-800',
      },
      dark: {
        shadow: 'shadow-2xl',
        iconBg: 'bg-white/10 dark:bg-black/10',
        iconText: 'text-white dark:text-black',
        iconBorder: 'border-transparent',
      },
    };

    return JSON.stringify(colors[this.color]);
  }

  get colorConfig() {
    return JSON.parse(this.colorClasses);
  }

  get isDarkVariant(): boolean {
    return this.color === 'dark';
  }

  get isCompact(): boolean {
    return this.variant === 'compact';
  }

  get labelColorClass(): string {
    if (this.isCompact && !this.isDarkVariant) {
      const colorMap: Record<MetricCardColor, string> = {
        indigo: 'text-indigo-600',
        emerald: 'text-emerald-600',
        amber: 'text-amber-600',
        rose: 'text-rose-600',
        dark: 'text-indigo-400 dark:text-indigo-600',
      };
      return colorMap[this.color] || 'text-indigo-600';
    }
    return 'text-slate-400 dark:text-neutral-600';
  }
}