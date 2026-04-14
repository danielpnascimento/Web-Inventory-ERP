import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { Offcanvas } from 'bootstrap';
import { ProductsFormModel } from '../../../shared/models/products-form.model';
import { ProductsForm } from '../products-form/products-form';
import { DragScrollDirective } from '../../../shared/components/directives/drag-scroll.directive';
import { ProductsListModel } from '../../../shared/models/products-list.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductsForm, FormsModule, ReactiveFormsModule, DragScrollDirective],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss'
})
export class Products implements OnInit {

  list: ProductsListModel[] = [];
  listFiltered: ProductsListModel[] = [];
  productEdit = new ProductsFormModel();

  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  searchControl = new FormControl('');
  noResults = false;

  private offcanvas!: Offcanvas;

  constructor(
    private productService: ProductService,
    private toast: ToastService,

  ) { }


  ngOnInit(): void {
    this.loadProduct();

    this.searchControl.valueChanges.subscribe(value => {
      this.currentPage = 1;
      this.filteredlist();
    });

    setTimeout(() => {
      this.filteredlist();
    });

    const el = document.getElementById('offcanvasProduct');
    if (el) {
      this.offcanvas = new Offcanvas(el);
    }

  }

  loadProduct() {
    this.productService.findAllProduct().subscribe(
      data => {
        this.list = [...data];
        this.listFiltered = [];
        this.filteredlist();
      });
  }


  filteredlist() {
    const term = this.searchControl.value?.toLowerCase() || '';
    this.listFiltered = this.list.filter(c =>
      String(c.id || '').includes(term) ||
      c.name?.toLowerCase().includes(term) ||
      (c.code || '').toLowerCase().includes(term) ||
      String(c.price || '').includes(term)
    );

    this.noResults = this.listFiltered.length === 0;
    this.totalPages = Math.max(
      1,
      Math.ceil(this.listFiltered.length / this.pageSize)
    );

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  getItemsPaginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.listFiltered.slice(start, start + this.pageSize);
  }

  trackById(_index: number, item: ProductsListModel) {
    return item.id;
  }

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

  onPageSizeChange() {
    this.currentPage = 1;
    this.totalPages = Math.max(
      1,
      Math.ceil(this.listFiltered.length / this.pageSize)
    );
  }

  openOffcanvas(product?: ProductsFormModel) {
    this.productEdit = product ?? new ProductsFormModel();
    this.offcanvas.show();
  }

  closeOffcanvas() {
    this.offcanvas.hide();
  }

  returnRegister(p: ProductsListModel) {
    const product: ProductsListModel = {
      id: p.id ?? null,
      code: p.code || '',
      name: p.name || '',
      price: p.price || 0,
    };
    const index = this.list.findIndex(x => x.id === product.id);

    if (index !== -1) {
      this.list[index] = product;
    }

    this.list = [...this.list];
    this.closeOffcanvas();
    this.loadProduct();
  }

  edit(c: ProductsListModel) {
    this.productService.findByIdProduct(c.id!).subscribe(full => {
      this.openOffcanvas(full);
    });
  }

  deleteById(id: number) {
    this.toast.confirm('Do you want to delete?', () => {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProduct();
        this.toast.show('Deleted successfully', 'success');
      });
    });
  }




}
