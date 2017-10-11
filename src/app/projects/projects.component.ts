import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Project } from './project.model';

import { DataService } from '../data.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projectsObservable: Observable<Project[]>;
  projects: Project[];
  newProjectTitle: string;
  newProjectKey: string;
  newTaskTitle: string;

  constructor(
    private _dataService: DataService
  ) { }

  ngOnInit() {
    // Get projects
    this.projectsObservable = this._dataService.getList('projects');

    this.projectsObservable.subscribe(projects => {
      this.projects = projects;

      // Set default project for new task
      if (projects.length > 0) {
        this.newProjectKey = projects[0].key;
      }
    });
  }

  /**
   * Adds a new project to the data source.
   */
  addProject() {
    this._dataService.addObject({ title: this.newProjectTitle }, 'projects');
    this.newProjectTitle = '';
  }

  /**
   * Adds a new task to the data source.
   */
  addTask() {
    // Add to "tasks" object
    this._dataService.addObject({
      project: this.newProjectKey,
      title: this.newTaskTitle
    }, 'tasks')
      .then(taskRef => {
        // Update project tasks
        const projectWithNewTask = this.projects.find(
          project => project.key === this.newProjectKey
        );

        if (!projectWithNewTask.hasOwnProperty('tasks')) {
          projectWithNewTask.tasks = {};
        }

        projectWithNewTask.tasks[taskRef.key] = true;

        this._dataService.updateObject(
          {
            tasks: projectWithNewTask.tasks
          },
          'projects/' + this.newProjectKey
        );

        // Clear task title text box
        this.newTaskTitle = '';
      });
  }
}
