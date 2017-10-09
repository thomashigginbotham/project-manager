import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
  constructor(
    private _db: AngularFireDatabase
  ) { }

  /**
   * Returns an observable of database objects below a given path.
   * @param path The path to the database object.
   */
  getList<T>(path: string): Observable<T[]> {
    return this._db.list(path).valueChanges();
  }
}
