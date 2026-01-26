
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskRequest, TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskStatus, getTaskPriorityInfo, getStatusInfo } from '../../types/task.type';
import { InputComponent } from '../../shared/components/input/input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SelectComponent } from '../../shared/components/select/select.component';

interface TaskForm {
  title: FormControl<string>;
  description: FormControl<string>;
  endDate: FormControl<string>;
  priority: FormControl<TaskPriority>;
  status: FormControl<TaskStatus>;
}

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputComponent, 
    ModalComponent,
    SelectComponent
  ],
  templateUrl: './task-form-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormModal implements OnChanges {
  @Input() isOpen = false;
  @Input() task: Task | null = null;
  @Input() projectEndDate = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TaskRequest>();

  taskForm!: FormGroup<TaskForm>;
  
  // These are passed to app-dropdown as [options]
  priorities = TASK_PRIORITIES;
  statuses = TASK_STATUSES;

  get isEditMode(): boolean {
    return this.task !== null;
  }

  constructor(private cdr: ChangeDetectorRef) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.taskForm) return;
    
    if (changes['isOpen'] && this.isOpen) {
      if (this.task) {
        this.populateForm();
      } else {
        this.resetForm();
      }
      this.cdr.markForCheck();
    }
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.taskForm = new FormGroup<TaskForm>({
      title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
      endDate: new FormControl(today, { nonNullable: true, validators: [Validators.required] }),
      priority: new FormControl<TaskPriority>('MEDIUM', { nonNullable: true, validators: [Validators.required] }),
      status: new FormControl<TaskStatus>('TODO', { nonNullable: true, validators: [Validators.required] }),
    });
  }

  private resetForm(): void {
    if (!this.taskForm) return;
    const today = new Date().toISOString().split('T')[0];
    this.taskForm.reset({
      title: '',
      description: '',
      endDate: today,
      priority: 'MEDIUM',
      status: 'TODO',
    });
    this.taskForm.markAsUntouched();
  }

  private populateForm(): void {
    if (this.task && this.taskForm) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        endDate: this.task.endDate,
        priority: this.task.priority,
        status: this.task.status,
      });
      this.taskForm.markAsUntouched();
      this.cdr.markForCheck();
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.getRawValue();
      
      if (this.projectEndDate && formValue.endDate > this.projectEndDate) {
        return;
      }
      
      this.save.emit(formValue);
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key as keyof TaskForm);
        control?.markAsTouched();
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) {
        const minLength = control.errors['minlength'].requiredLength;
        return `Minimum ${minLength} characters required`;
      }
    }
    return '';
  }

  isDateInvalid(): boolean {
    const endDate = this.taskForm.get('endDate')?.value;
    return !!(this.projectEndDate && endDate && endDate > this.projectEndDate);
  }
}
