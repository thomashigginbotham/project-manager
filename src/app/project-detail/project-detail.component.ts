import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Project } from '../projects/project.model';
import { Task } from '../tasks/task.model';

import { DataService } from '../data.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  projectObservable: Observable<Project>;
  taskObservables: Observable<Task>[];
  project: Project;
  projectKey: string;
  tasks: Task[];
  newTaskTitle: string;

  constructor(
    private _dataService: DataService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.project = {} as Project;
    this.tasks = [];
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      const projectKey = params['projectKey'];
      this.projectKey = params['projectKey'];

      // Bind project
      this.projectObservable = this._dataService.getObject(
        this.projectKey,
        'projects'
      );

      this.projectObservable.subscribe(project => {
        this.project = project;

        // Bind tasks
        this.tasks = [];

        if (project.hasOwnProperty('tasks')) {
          this.taskObservables = Object.keys(project.tasks).map(taskKey => {
            return this._dataService.getObject(taskKey, 'tasks');
          });

          Observable.merge(...this.taskObservables).subscribe(task => {
            this.tasks.push(task);
          });
        }
      });
    });
  }

  /**
   * Adds a new task to the data source.
   */
  addTask() {
    // Add to "tasks" object
    this._dataService.addObject({
      project: this.projectKey,
      title: this.newTaskTitle
    }, 'tasks')
      .then(taskRef => {
        // Update project tasks
        if (!this.project.hasOwnProperty('tasks')) {
          this.project.tasks = {};
        }

        this.project.tasks[taskRef.key] = true;

        this._dataService.updateObject(
          {
            tasks: this.project.tasks
          },
          'projects/' + this.projectKey
        );

        // Clear task title text box
        this.newTaskTitle = '';
      });
  }
}
