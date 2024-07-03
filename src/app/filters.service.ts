import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filtersSubject = new Subject<any>();
  filters$ = this.filtersSubject.asObservable();

  updateFilters(filters: any) {
    this.filtersSubject.next(filters);
  }
}
