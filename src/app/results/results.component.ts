import { Component, OnInit } from '@angular/core';
import { SwapiService } from '../swapi.service';
import { FilterService } from '../filters.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results: any[] = [];
  filteredResults: any[] = [];
  currentPage = 1;
  pageSize = 5;
  paginatedResults: any[] = [];
  totalPages = 0;
  pageNumbers: number[] = [];

  constructor(private service: SwapiService, private filterService: FilterService) {}

  ngOnInit(): void {
    this.getData();
    this.filterService.filters$.subscribe(filters => {
      this.applyFilters(filters);
    });
  }

  getData(): void {
    this.service.fetchData().subscribe(data => {
      this.results = data;
      this.filteredResults = [...this.results]; // Initialize filteredResults with all results
      this.updatePagination();
      this.updatePaginatedResults();
    });
  }

  applyFilters(filters: any): void {
    this.filteredResults = this.results.filter(result => {
      return (!filters.movie || result.films.includes(filters.movie)) &&
             (!filters.species || result.species.includes(filters.species)) &&
             (!filters.vehicle || result.vehicles.includes(filters.vehicle)) &&
             (!filters.starship || result.starships.includes(filters.starship)) &&
             (!filters.birthYear || result.birth_year === filters.birthYear);
    });
    this.currentPage = 1; // Reset to the first page after applying filters
    this.updatePagination();
    this.updatePaginatedResults();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredResults.length / this.pageSize);
    this.pageNumbers = Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  updatePaginatedResults(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedResults = this.filteredResults.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePaginatedResults();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedResults();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedResults();
    }
  }
}
