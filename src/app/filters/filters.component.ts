import { Component, OnInit } from '@angular/core';
import { SwapiService } from '../swapi.service';
import { FilterService } from '../filters.service';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  films: any[] = [];
  species: any[] = [];
  vehicles: any[] = [];
  starships: any[] = [];
  birthYears: any[] = [];

  selectedMovie: string = '';
  selectedSpecies: string = '';
  selectedVehicle: string = '';
  selectedStarship: string = '';
  selectedBirthYear: string = '';

  constructor(private service: SwapiService, private filterService: FilterService) { }

  ngOnInit(): void {
    this.filmData();
    this.speciesData();
    this.vehicleData();
    this.starshipData();
    this.birthYearData();
  }

  filmData() {
    this.service.getFilms().subscribe((data) => {
      this.films = data;
      console.log("this is films array", this.films);
    });
  }

  speciesData() {
    this.service.getSpecies().subscribe((data) => {
      this.species = data;
      console.log("this is species", this.species);
    });
  }

  vehicleData() {
    this.service.getVehicle().subscribe((data) => {
      this.vehicles = data;
      console.log("this is vehicles", this.vehicles);
    });
  }

  starshipData() {
    this.service.getStarShips().subscribe((data) => {
      this.starships = data;
      console.log("this is starships", this.starships);
    });
  }

  birthYearData() {
    this.service.getBirthYears().subscribe((data) => {
      this.birthYears = data;
      console.log("this is birth years", this.birthYears);
    });
  }

  search() {
    const filters = {
      movie: this.selectedMovie,
      species: this.selectedSpecies,
      vehicle: this.selectedVehicle,
      starship: this.selectedStarship,
      birthYear: this.selectedBirthYear
    };
    console.log('Filters:', filters);
    this.actualSearch();
    this.resetFilters();
    this.filterService.updateFilters(filters);
  }

  resetFilters() {
    this.selectedMovie = '';
    this.selectedSpecies = '';
    this.selectedVehicle = '';
    this.selectedStarship = '';
    this.selectedBirthYear = '';
    // Optionally, you can trigger a search or update filters service here to reset data
  }

  actualSearchArray: any[]=[];
  getActualPerson:any;
  getActualSpecies:any[]=[];
  getActualVehicle:any[]=[];
  
  actualSearch(){
    console.log("here is ",);
    // for(let i=0;i<this.films.length;i++)
    //   {
    //     for(let j=0;j<this.films[i].people.length;j++)
    //       {
    //         if(!this.actualSearchArray.includes(this.films[i].characters[j]))
    //           {
    //             this.actualSearchArray.push(this.films[i].characters[j])
    //           }
    //       }
    //   }
    //   console.log("filtered people array from films", this.actualSearchArray)

      this.getActualPerson = this.films.filter((film)=>{
        return film.title == this.selectedMovie;
      })
      
      this.getActualSpecies = this.species.filter((species)=>{
        return species.name == this.selectedSpecies;
      })

      console.log("filtered people array from films2 : ", this.getActualPerson,this.getActualSpecies)

  }
  

}
