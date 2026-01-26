import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ProjectService } from './project';
import { TaskService } from './task';
import { Project } from '../types/project.type';
import { Task } from '../types/task.type';

export interface SearchResult {
  projects: Project[];
  tasks: Task[];
  allProjects: Project[]; // Todos os projetos para referência (usado para exibir nome do projeto nas tarefas)
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  /**
   * Busca completa por projetos e tarefas
   */
  searchAll(query: string): Observable<SearchResult> {
    if (!query.trim()) {
      return of({ projects: [], tasks: [], allProjects: [] });
    }

    const normalizedQuery = query.toLowerCase().trim();

    return this.projectService.getProjects().pipe(
      switchMap((projects) => {
        if (projects.length === 0) {
          return of({ projects: [], tasks: [], allProjects: [] });
        }

        // Busca projetos que correspondem à query
        const matchingProjects = projects.filter(
          (project) =>
            project.name.toLowerCase().includes(normalizedQuery) ||
            (project.description && project.description.toLowerCase().includes(normalizedQuery))
        );

        // Busca tarefas em todos os projetos
        const taskRequests = projects.map((project) =>
          this.taskService.getTasks(project.id).pipe(
            map((tasks) => tasks || []),
            catchError(() => of([]))
          )
        );

        return forkJoin(taskRequests).pipe(
          map((taskArrays: Task[][]) => {
            // Filtra tarefas que correspondem à query
            const matchingTasks = taskArrays
              .flat()
              .filter(
                (task) =>
                  task &&
                  (task.title.toLowerCase().includes(normalizedQuery) ||
                    (task.description && task.description.toLowerCase().includes(normalizedQuery)))
              );

            return {
              projects: matchingProjects,
              tasks: matchingTasks,
              allProjects: projects, // Inclui todos os projetos para referência
            };
          })
        );
      }),
      catchError((error) => {
        console.error('Erro ao buscar:', error);
        return of({ projects: [], tasks: [], allProjects: [] });
      })
    );
  }
}
