import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DashboardLayout } from '../../components/dashboard-layout/dashboard-layout';
import { UserProfileService, UserProfile } from '../../services/user-profile';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayout],
  templateUrl: './settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings implements OnInit {
  profile: UserProfile | null = null;
  isLoading = true;
  isSaving = false;

  // Form fields
  name = '';
  email = '';
  profilePhoto = '';

  // Active tab
  activeTab: 'profile' | 'about' = 'profile';

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.userProfileService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        this.profile = profile;
        this.name = profile.name;
        this.email = profile.email;
        this.profilePhoto = profile.profilePhoto || '';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Failed to load profile');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  saveProfile(): void {
    if (!this.name.trim() || !this.email.trim()) {
      this.toastr.error('Name and email are required');
      return;
    }

    this.isSaving = true;
    this.cdr.markForCheck();

    this.userProfileService.updateProfile({
      name: this.name,
      email: this.email,
      profilePhoto: this.profilePhoto || undefined,
    }).subscribe({
      next: (profile: UserProfile) => {
        this.profile = profile;
        sessionStorage.setItem('name', profile.name);
        this.toastr.success('Profile updated successfully!');
        this.isSaving = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Failed to update profile. Email may already be in use.');
        this.isSaving = false;
        this.cdr.markForCheck();
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        this.toastr.error('Image must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePhoto = e.target?.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.profilePhoto = '';
    this.cdr.markForCheck();
  }

  setActiveTab(tab: 'profile' | 'about'): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  get userInitial(): string {
    return this.name ? this.name.charAt(0).toUpperCase() : 'U';
  }
}
