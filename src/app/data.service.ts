import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
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
    return this._db.list(path).snapshotChanges().map(actions => {
      const list: T[] = actions.map(action => {
        const obj: T = action.payload.val() as T;

        obj['key'] = action.key;

        return obj;
      });

      return list;
    });
  }

  /**
   * Adds a new object to the database.
   * @param obj The object to add to the database.
   * @param path The path to the new object's parent.
   */
  addObject<T>(obj: T, path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this._db.database.ref().child(path);

      ref.push(obj)
        .then(
          result => resolve(result),
          error => reject(error)
        );
    });
  }

  /**
   * Updates an object in the database.
   * @param obj An object with updated values.
   * @param path The path of the object to update.
   */
  updateObject<T>(obj: T, path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this._db.object(path);

      ref.update(obj)
        .then(
          result => resolve(result),
          error => reject(error)
        );
    });
  }
}
