import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../../core/services/material.service';
import { Offcanvas } from 'bootstrap';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RawMaterialsListModel } from '../../../shared/models/raw-materials-list.model';
import { RawMaterialFormModel } from '../../../shared/models/raw-material-form.model';
import { DragScrollDirective } from '../../../shared/components/directives/drag-scroll.directive';
import { ToastService } from '../../../core/services/toast.service';
import { RawMaterialForm } from '../raw-material-form/raw-material-form';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-raw-materials-list',
  standalone: true,
  imports: [CommonModule, RawMaterialForm, FormsModule, ReactiveFormsModule, DragScrollDirective],
  templateUrl: './raw-materials-list.html'
})

export class RawMaterialsList implements OnInit {

  list: RawMaterialsListModel[] = [];
  filteredList: RawMaterialsListModel[] = [];
  materialEdit = new RawMaterialFormModel();

  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  searchControl = new FormControl('');
  noResults = false;

  private offcanvas!: Offcanvas;

  constructor(
    private materialService: MaterialService,
    private toast: ToastService,
    private http: HttpClient

  ) { }

  ngOnInit() {
    this.loadMaterial();

    this.searchControl.valueChanges.subscribe(value => {
      this.currentPage = 1;
      this.filterMaterial();
    });

    setTimeout(() => {
      this.filterMaterial();
    });

    const el = document.getElementById('offcanvasMaterial');
    if (el) {
      this.offcanvas = new Offcanvas(el);
    }


  }

  loadMaterial() {
    this.materialService.findAllMaterial().subscribe(
      data => {
        this.list = [...data];
        this.filteredList = [];
        this.filterMaterial();
      });
  }

  filterMaterial() {
    const term = this.searchControl.value?.toLowerCase() || '';
    this.filteredList = this.list.filter(c =>
      String(c.id || '').includes(term) ||
      c.name?.toLowerCase().includes(term) ||
      (c.code || '').toLowerCase().includes(term) ||
      String(c.quantityInStock || '').includes(term) ||
      (c.measure || '').toLowerCase().includes(term)
    );

    this.noResults = this.filteredList.length === 0;

    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredList.length / this.pageSize)
    );

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  getItemsPaginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(start, start + this.pageSize);
  }

  trackById(_index: number, item: RawMaterialsListModel) {
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
      Math.ceil(this.filteredList.length / this.pageSize)
    );
  }

  openOffcanvas(material?: RawMaterialsListModel) {
    this.materialEdit = material ? { ...material } : {} as any;
    this.offcanvas.show();
  }

  closeOffcanvas() {
    this.offcanvas.hide();
  }

  returnRegister(m: RawMaterialsListModel) {
    const material: RawMaterialsListModel = {
      id: m.id ?? null,
      code: m.code || '',
      name: m.name || '',
      quantityInStock: m.quantityInStock || 0,
      measure: m.measure || ''
    };

    const index = this.list.findIndex(x => x.id === material.id);

    if (index !== -1) {
      this.list[index] = material;
    }

    this.list = [...this.list];
    this.closeOffcanvas();
    this.loadMaterial();
  }

  edit(c: RawMaterialsListModel) {
    this.openOffcanvas(c);
  }

  deleteById(id: number) {
    this.toast.confirm('Are you sure you want to delete?', () => {
      this.materialService.deleteMaterial(id).subscribe({
        next: () => {
          this.loadMaterial();
          this.toast.show('Deleted successfully!', 'success');
        },
        error: (err) => {
          this.toast.show('Cannot delete: This raw material is already linked to a Product composition!', 'error');
        }
      });
    });
  }




}
