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

  constructor(
    private _dataService: DataService
  ) { }

  ngOnInit() {
    // Get projects
    this.projectsObservable = this._dataService.getList('projects');

    this.projectsObservable.subscribe(projects => {
      this.projects = projects;
    });
  }

  /**
   * Adds a new project to the data source.
   */
  addProject() {
    this._dataService.addObject({ title: this.newProjectTitle }, 'projects');
    this.newProjectTitle = '';
  }
}
