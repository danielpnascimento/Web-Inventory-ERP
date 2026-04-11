import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragScrollDirective } from '../../shared/components/directives/drag-scroll.directive';
import { ProductionMaximumModel } from '../../shared/models/production-maximum.model';
import { ProductionMaximumService } from '../../core/services/production-maximum.service';

@Component({
  selector: 'app-production-maximum',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragScrollDirective],
  templateUrl: './production-maximum.html',
  styleUrl: './production-maximum.scss',
})
export class ProductionMaximum implements OnInit {

  list: ProductionMaximumModel[] = [];
  filteredList: ProductionMaximumModel[] = [];

  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  searchControl = new FormControl('');
  noResults = false;

  maxVal: number = 0;

  constructor(
    private service: ProductionMaximumService
  ) { }

  ngOnInit(): void {
    this.loadProductionMaximum();

    this.searchControl.valueChanges.subscribe(value => {
      this.currentPage = 1; 
      this.filterProduct();
    });

    setTimeout(() => {
      this.filterProduct();
    });
  }

  // Method responsible for retrieving service data.
  loadProductionMaximum() {
    this.service.findAllProductionMaximum().subscribe({
      next: data => {
        this.list = [...data]; 
        this.filteredList = [];

        // Calculates the highest production value in the entire list (the winner)
        if (this.list && this.list.length > 0) {
          this.maxVal = Math.max(...this.list.map(p => p.maxProduction || 0));
        }

        this.filterProduct();
      },
      error: err => {
        console.error('Error searching for maximum production:', err);
      }
    });
  }

  // Logic for filtering based on the search term.
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

  // Returns only the items for the current page to be displayed in the table.
  getItemsPaginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(start, start + this.pageSize);
  }

  // Improves the performance of *ngFor by allowing Angular to track items by ID.
  trackById(_index: number, item: ProductionMaximumModel) {
    return item.id;
  }

  // Page navigation methods
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

  // Generates the array of page numbers for the pagination component.
  getPages(): number[] {
    const maxVisible = 3; 
    const pages: number[] = [];

    // Locks at the end
    if (this.currentPage >= this.totalPages - (maxVisible - 1)) {
      const start = Math.max(1, this.totalPages - maxVisible + 1);
      for (let i = start; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Normal start
    for (let i = 1; i <= maxVisible; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Updates the pagination when the user changes the number of items per page.
  onPageSizeChange() {
    this.currentPage = 1;
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredList.length / this.pageSize)
    );
  }
}
