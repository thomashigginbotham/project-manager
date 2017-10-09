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
  projectsObjservable: Observable<Project[]>;
  projects: Project[];

  constructor(
    private _dataService: DataService
  ) { }

  ngOnInit() {
    // Get projects
    this.projectsObjservable = this._dataService.getList('projects');

    this.projectsObjservable.subscribe(projects => {
      this.projects = projects;
    });
  }
}
