import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {

  private api = "https://swapi.dev/api/people/";

  constructor(private http: HttpClient) { }

  fetchData(): Observable<any[]> {
    return this.http.get<any>(this.api).pipe(
      map(response => response.results)
    );
  }

  getFilms(): Observable<any[]> {
    return this.http.get<any>("https://swapi.dev/api/films/").pipe(
      map(response => response.results)
    );
  }

  getSpecies(): Observable<any[]> {
    return this.http.get<any>("https://swapi.dev/api/species/").pipe(
      map(response => response.results)
    );
  }

  getVehicle(): Observable<any[]> {
    return this.http.get<any>("https://swapi.dev/api/vehicles/").pipe(
      map(response => response.results)
    );
  }

  getStarShips(): Observable<any[]> {
    return this.http.get<any>("https://swapi.dev/api/starships/").pipe(
      map(response => response.results)
    );
  }

  getPerson(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}${id}/`);
  }

  getBirthYears(): Observable<string[]> {
    const baseUrl: string = 'https://swapi.dev/api/people/';
    let url: string = baseUrl; // Initialize with string instead of string | null
    let birthYears: string[] = [];

    return new Observable<string[]>((observer) => {
      const fetchDataRecursive = () => {
        this.http.get<any>(url).subscribe((data) => {
          data.results.forEach((person: any) => {
            if ( !birthYears.includes(person.birth_year)) {
              birthYears.push(person);
            }
          });

          url = data.next as string; // Cast 'next' as string, since it can be null or string
          if (url) {
            fetchDataRecursive();
          } else {
            observer.next(birthYears);
            observer.complete();
          }
        }, (error) => {
          observer.error(error);
        });
      };

      fetchDataRecursive();
    });
  }


  // Fetch person data using observables
  fetchPersonData(personId: number): Observable<any> {
    return this.http.get<any>(`${this.api}${personId}/`).pipe(
      switchMap(person => {
        console.log("Fetched person:", person); // Log the person data

        // Check if films, vehicles, and starships arrays exist
        const filmObservables = person.films ? person.films.map((url: string) => this.http.get<any>(url).pipe(catchError(() => of(null)))) : [];
        const vehicleObservables = person.vehicles ? person.vehicles.map((url: string) => this.http.get<any>(url).pipe(catchError(() => of(null)))) : [];
        const starshipObservables = person.starships ? person.starships.map((url: string) => this.http.get<any>(url).pipe(catchError(() => of(null)))) : [];

        return forkJoin({
          person: of(person),
          films: forkJoin(filmObservables),
          vehicles: forkJoin(vehicleObservables),
          starships: forkJoin(starshipObservables)
        });
      }),
      catchError(error => {
        console.error('Error fetching person data:', error);
        return of({ person: null, films: [], vehicles: [], starships: [] });
      })
    );
  }

  fetchDataForPerson(personId:any): Observable<any[]> {
    console.log("in fetch person data 2:",`${this.api}${personId}/`)
    return this.http.get<any>(`${this.api}${personId}/`).pipe(
      map(response => response.results)
    );
  }


}
