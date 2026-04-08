import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductAnalysis, ProductionOptimizationModel } from '../../shared/models/production-optimization.model';
import { ProductionOptimizationService } from '../../core/services/production-optimization.service';
import { DragScrollDirective } from '../../shared/components/directives/drag-scroll.directive';

@Component({
  selector: 'app-production-optimization',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragScrollDirective],
  templateUrl: './production-optimization.html',
  styleUrl: './production-optimization.scss',
})
export class ProductionOptimization implements OnInit {

  list: ProductAnalysis[] = [];
  filteredList: ProductAnalysis[] = [];
  recommendedProduct: string = '';

  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  searchControl = new FormControl('');
  noResults = false;

  maxVal: number = 0;

  constructor(
    private service: ProductionOptimizationService
  ) { }

  ngOnInit(): void {
    this.loadProductionOptimization();

    this.searchControl.valueChanges.subscribe(value => {
      this.currentPage = 1;
      this.filterProduct();
    });

    setTimeout(() => {
      this.filterProduct();
    });
  }

  //Method responsible for fetching data from the service.
  loadProductionOptimization() {
    this.service.findAllProductionOptimization().subscribe({
      next: (response: ProductionOptimizationModel) => {

        this.list = [...(response.productsMaximum || [])];
        this.recommendedProduct = response.recommendedProduct || '';
        this.filteredList = [];

        if (this.list && this.list.length > 0) {
          this.maxVal = Math.max(...this.list.map(p => p.maxProduction || 0));
        }

        this.filterProduct();
      },
      error: err => {
        console.error('Error fetching optimized production:', err);
      }
    });
  }

  //Filtering logic based on the search term.
  filterProduct() {
    const term = this.searchControl.value?.toLowerCase() || '';

    this.filteredList = this.list.filter(c =>
      String(c.id || '').includes(term) ||
      (c.product || '').toLowerCase().includes(term) ||
      (c.code || '').toLowerCase().includes(term)
    );

    this.noResults = this.filteredList.length === 0;

    this.totalPages = Math.max(1, Math.ceil(this.filteredList.length / this.pageSize));

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  //Returns only the items of the current page for display in the table.
  getItemsPaginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(start, start + this.pageSize);
  }

  // Improves the performance of *ngFor by allowing Angular to track items by ID.
  trackById(_index: number, item: ProductAnalysis) {
    return item.id;
  }

  // --- Page Navigation Methods ---
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage() {
    this.changePage(this.currentPage + 1);
  }

  prevPage() {
    this.changePage(this.currentPage - 1);
  }

  //Generates the array of page numbers for the pagination component.
  getPages(): number[] {
    const maxVisible = 3;
    const pages: number[] = [];

    if (this.currentPage >= this.totalPages - (maxVisible - 1)) {
      const start = Math.max(1, this.totalPages - maxVisible + 1);
      for (let i = start; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    for (let i = 1; i <= maxVisible; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Updates pagination when the user changes the number of items per page.
  onPageSizeChange() {
    this.currentPage = 1;
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredList.length / this.pageSize)
    );
  }
}
