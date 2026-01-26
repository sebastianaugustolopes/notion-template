
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project, ProjectRequest, PROJECT_TYPES, PRIORITIES, ProjectType, Priority, getPriorityInfo, getProjectTypeInfo } from '../../types/project.type';
import { InputComponent } from '../../shared/components/input/input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SelectComponent } from '../../shared/components/select/select.component';

interface ProjectForm {
  name: FormControl<string>;
  description: FormControl<string>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
  type: FormControl<ProjectType>;
  priority: FormControl<Priority>;
}

@Component({
  selector: 'app-project-form-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputComponent, 
    ModalComponent,
    SelectComponent
  ],
  templateUrl: './project-form-modal.html',
})
export class ProjectFormModal implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ProjectRequest>();

  projectForm!: FormGroup<ProjectForm>;
  
  // Transform types/priorities to match DropdownOption interface if needed
  // Assuming PROJECT_TYPES and PRIORITIES are already compatible with { label, value }
  projectTypes = PROJECT_TYPES;
  priorities = PRIORITIES;

  get isEditMode(): boolean {
    return this.project !== null;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.projectForm) return;
    
    if (changes['isOpen'] && this.isOpen) {
      if (this.project) {
        this.populateForm();
      } else {
        this.resetForm();
      }
    }
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.projectForm = new FormGroup<ProjectForm>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
      startDate: new FormControl(today, { nonNullable: true, validators: [Validators.required] }),
      endDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      type: new FormControl<ProjectType>('PERSONAL', { nonNullable: true, validators: [Validators.required] }),
      priority: new FormControl<Priority>('MEDIUM', { nonNullable: true, validators: [Validators.required] }),
    });
  }

  private resetForm(): void {
    if (!this.projectForm) return;
    const today = new Date().toISOString().split('T')[0];
    this.projectForm.reset({
      name: '',
      description: '',
      startDate: today,
      endDate: '',
      type: 'PERSONAL',
      priority: 'MEDIUM',
    });
    this.projectForm.markAsUntouched();
  }

  private populateForm(): void {
    if (this.project && this.projectForm) {
      this.projectForm.patchValue({
        name: this.project.name,
        description: this.project.description,
        startDate: this.project.startDate,
        endDate: this.project.endDate,
        type: this.project.type,
        priority: this.project.priority,
      });
      this.projectForm.markAsUntouched();
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.getRawValue();
      this.save.emit(formValue);
    } else {
      Object.keys(this.projectForm.controls).forEach(key => {
        const control = this.projectForm.get(key as keyof ProjectForm);
        control?.markAsTouched();
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getErrorMessage(controlName: string): string {
    const control = this.projectForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) {
        const minLength = control.errors['minlength'].requiredLength;
        return `Minimum ${minLength} characters required`;
      }
    }
    return '';
  }

  hasError(controlName: string): boolean {
    const control = this.projectForm.get(controlName);
    return !!(control?.errors && control.touched);
  }
}
