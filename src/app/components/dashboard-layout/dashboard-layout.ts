import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile';
import { SearchService, SearchResult } from '../../services/search';
import { Project } from '../../types/project.type';
import { Task } from '../../types/task.type';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout implements OnInit {
  @Output() createProject = new EventEmitter<void>();
  
  // Estado do usuário
  userName: string = '';
  userInitials: string = '';
  userProfilePhoto: string | null = null;
  
  // Estado da UI
  isSidebarOpen: boolean = true;
  isMobileMenuOpen: boolean = false;
  isProfileMenuOpen: boolean = false;
  isSearchOpen: boolean = false;
  searchQuery: string = '';
  searchResults: SearchResult = { projects: [], tasks: [], allProjects: [] };
  isSearching: boolean = false;

  // Navegação
  navigationItems = [
    {
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      route: '/dashboard'
    },
    {
      label: 'Projects',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      route: '/projects'
    },
    {
      label: 'Calendar',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      route: '/calendar'
    },
    {
      label: 'Settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      route: '/settings'
    }
  ];

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private searchService: SearchService
  ) {
    this.userName = sessionStorage.getItem('name') || 'User';
    this.userInitials = this.getInitials(this.userName);
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.setupResponsiveListener();
  }

  /**
   * Carrega o perfil do usuário do serviço
   */
  loadUserProfile(): void {
    this.userProfileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfilePhoto = profile.profilePhoto || null;
        if (profile.name) {
          this.userName = profile.name;
          this.userInitials = this.getInitials(profile.name);
        }
      },
      error: () => {
        this.userProfilePhoto = null;
      }
    });
  }

  /**
   * Configura listener para ajustar sidebar em diferentes resoluções
   */
  setupResponsiveListener(): void {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        this.isSidebarOpen = false;
      } else {
        this.isSidebarOpen = true;
        this.isMobileMenuOpen = false;
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  }

  /**
   * Obtém as iniciais do nome do usuário
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Alterna visibilidade da sidebar
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Alterna menu mobile
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Alterna menu de perfil
   */
  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  /**
   * Fecha menus ao clicar fora
   */
  closeMenus(): void {
    this.isProfileMenuOpen = false;
  }

  /**
   * Emite evento para criar novo projeto
   */
  onCreateProject(): void {
    this.createProject.emit();
  }

  /**
   * Verifica se a rota está ativa
   */
  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  /**
   * Navega para a rota especificada
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
    // Fecha menu mobile após navegação
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    this.router.navigate(['/login']);
  }

  /**
   * TrackBy para otimizar renderização de navegação
   */
  trackByRoute(index: number, item: any): string {
    return item.route;
  }

  /**
   * Abre o modal de busca
   */
  openSearch(): void {
    this.isSearchOpen = true;
    this.searchResults = { projects: [], tasks: [], allProjects: [] };
    this.searchQuery = '';
  }

  /**
   * Fecha o modal de busca
   */
  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.searchResults = { projects: [], tasks: [], allProjects: [] };
  }

  /**
   * Realiza busca em tempo real
   */
  onSearchInput(query: string): void {
    if (!query.trim()) {
      this.searchResults = { projects: [], tasks: [], allProjects: [] };
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    
    this.searchService.searchAll(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Erro ao buscar:', error);
        this.searchResults = { projects: [], tasks: [], allProjects: [] };
        this.isSearching = false;
      }
    });
  }

  /**
   * Navega para um projeto específico
   */
  navigateToProject(project: Project): void {
    this.router.navigate(['/project', project.id]);
    this.closeSearch();
  }

  /**
   * Navega para uma tarefa específica - redireciona para o projeto da tarefa
   */
  navigateToTask(task: Task): void {
    if (task.projectId) {
      this.router.navigate(['/project', task.projectId]);
      this.closeSearch();
    }
  }

  /**
   * Executa a busca completa - navega para o primeiro resultado se houver
   */
  performSearch(query: string): void {
    if (!query.trim()) {
      this.closeSearch();
      return;
    }
    
    // Se houver resultados, navega para o primeiro projeto ou tarefa
    if (this.searchResults.projects.length > 0) {
      this.navigateToProject(this.searchResults.projects[0]);
    } else if (this.searchResults.tasks.length > 0) {
      this.navigateToTask(this.searchResults.tasks[0]);
    } else {
      // Se não houver resultados, fecha a busca
      this.closeSearch();
    }
  }

  /**
   * Manipula eventos de teclado (Cmd+K para abrir busca)
   */
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  /**
   * Obtém o nome do projeto pelo ID
   */
  getProjectName(projectId: string): string {
    // Primeiro tenta encontrar nos projetos que correspondem à busca
    let project = this.searchResults.projects.find((p) => p.id === projectId);
    
    // Se não encontrou, busca em todos os projetos (para tarefas de projetos que não corresponderam à busca)
    if (!project) {
      project = this.searchResults.allProjects.find((p) => p.id === projectId);
    }
    
    return project ? project.name : 'Project';
  }
}