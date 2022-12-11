import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphQLModeService {

  get active$() {
    return this._active$.asObservable();
  }

  get active() {
    return this._active$.value;
  }

  private readonly _active$ = new BehaviorSubject(false);

  toggle() {
    this._active$.next(!this._active$.value);
  }

}
