import { Component, OnInit } from '@angular/core';
import { SwapiService } from '../swapi.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  person: any;
  films: any[] = [];
  vehicles: any[] = [];
  starships: any[] = [];
  api="https://swapi.dev/api/people/";
  

  constructor(
    private route: ActivatedRoute,
    private swapiService: SwapiService,
    private http :HttpClient
  ) { }

  tempid!:number;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.tempid = id;
      if (id) {
        this.swapiService.fetchPersonData(id).subscribe(
          data => {
            this.person = data.person;
            this.films = data.films.filter((film: any) => film); // Filter out any null values
            this.vehicles = data.vehicles.filter((vehicle: any) => vehicle); // Filter out any null values
            this.starships = data.starships.filter((starship: any) => starship); // Filter out any null values

            // Log the data to the console
            console.log("Person:", this.person);
            console.log("Films:", this.films);
            console.log("Vehicles:", this.vehicles);
            console.log("Starships:", this.starships);
          },
          error => console.error('Error fetching data:', error)
        );
      }
    });
    this.getPerson();
  }

particularPerson!:any;
 getPerson(){
  console.log("Fetched particular person:2 :", this.tempid); // Log the person da
  this.http.get(`${this.api}${this.tempid}/`).subscribe((data)=>{
     this.particularPerson = data;
     console.log("Fetched particular person:", this.particularPerson); // Log the person dat
     this.getFilmsFromParticularPerson();
  })
  
}
filmsArray=[];
filmsName : any[]=[];
vehiclesName : any[] =[];
getFilmsFromParticularPerson(){
  this.filmsArray = this.particularPerson.films;
  this.getFilmTitles(this.filmsArray).then((titles) => {
    console.log("this are films:",titles);
    this.filmsName = titles;
  });
  this.getVehicles(this.filmsArray).then((data)=>{
    console.log("this are vehicles:",data);
    this.vehiclesName = data;
  })
}


// from this getting film array from person data
async  getFilmTitles(filmsArray: any[]) {
  const filmTitles = await Promise.all(
    filmsArray.map(async (filmArray) => {
          const response = await fetch(filmArray);
          const data = await response.json();
          return data;
      })
  );
  return filmTitles;
}

async getVehicles(filmsArray:any[]){
  const filmVehicle = await Promise.all(
      filmsArray.map(async (filmArray) =>{
        const response = await fetch(filmArray);
        const data = await response.json();
        return data;
      })
    );

    return filmVehicle;
}



}
