import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../core/services/product.service';
import { MaterialService } from '../../../core/services/material.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProductsFormModel } from '../../../shared/models/products-form.model';
import { ActivatedRoute } from '@angular/router';
import { ProductsListModel } from '../../../shared/models/products-list.model';
import { MeasurementTableCup } from '../measurement-table-cup/measurement-table-cup';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MeasurementTableCup],
  templateUrl: './products-form.html',
  styleUrls: ['./products-form.scss'],
})
export class ProductsForm {

  showTableMeasurements = false;

  toggleTableMeasurements() {
    this.showTableMeasurements = !this.showTableMeasurements;
  }

  @Input() selectedProduct: ProductsFormModel | null = null;
  @Output() returnRegister = new EventEmitter<ProductsListModel>();

  router = inject(ActivatedRoute);
  private materialService = inject(MaterialService);
  private productService = inject(ProductService);
  materials: any[] = [];

  materials$ = this.materialService.findAllMaterial();


  //Don't put KG and L this brings imprecision in the product registration
  measures = [
    { text: 'UN', value: 'UN' },
    { text: 'G', value: 'G' },
    { text: 'ML', value: 'ML' }
  ];


  //For the edit function to bring the registration data to the form "add the formBuilder in the constructor"
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0.01)]],
    compositions: this.fb.array([])
  });


  constructor(
    private fb: FormBuilder,
    private toastService: ToastService) { }


  ngOnChanges() {
    this.showTableMeasurements = false;
    if (!this.form) return;

    if (!this.selectedProduct) {
      this.form.reset();
      this.compositions.clear();
      this.addComposition();
      return;
    }

    const product = JSON.parse(JSON.stringify(this.selectedProduct));

    this.form.reset();
    this.compositions.clear();

    if (product.id) {
      this.form.patchValue({
        name: product.name,
        price: product.price
      });

      console.log("LOADING COMPOSITIONS:", product.compositions);

      if (product.compositions && product.compositions.length > 0) {
        product.compositions.forEach((c: any) => {
          console.log("MAPPING COMPOSITION ITEM:", c);
          this.compositions.push(this.createComposition(c));
        });
      }
    } else {
      this.form.patchValue({
        name: product.name || '',
        price: product.price || 0
      });
      this.addComposition();
    }
  }

  ngOnInit() {
    this.materialService.findAllMaterial().subscribe(res => {
      this.materials = res;
    });

    if (this.compositions.length === 0 && (!this.selectedProduct || !this.selectedProduct.id)) {
      this.addComposition();
    }
  }


  get compositions(): FormArray {
    return this.form.get('compositions') as FormArray;
  }

  addComposition() {
    this.compositions.push(this.createComposition());
  }

  createComposition(c?: any) {
    const group = this.fb.group({
      rawMaterialId: [
        c?.rawMaterial?.id ?? c?.rawMaterialId ?? null,
        Validators.required
      ],
      quantityRequired: [
        c?.quantityRequired ?? null,
        [Validators.required, Validators.min(0.01)]
      ],
      measure: [
        c?.measure ? c.measure.toUpperCase() : (c?.rawMaterial?.measure ? c.rawMaterial.measure.toUpperCase() : null),
        Validators.required
      ]
    });

    group.valueChanges.subscribe(value => {
      if (value.measure === 'UN' && value.quantityRequired !== null && value.quantityRequired !== '') {
        const num = Number(value.quantityRequired);

        if (!Number.isInteger(num)) {
          const intValue = Math.floor(num);

          group.get('quantityRequired')?.setValue(intValue, { emitEvent: false });
        }
      }
    });

    return group;
  }
  removeComposition(index: number) {
    this.compositions.removeAt(index);
  }

  save() {
    if (this.compositions.length === 0) {
      this.toastService.show('The product must have at least one ingredient!', 'warning');
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();

      this.toastService.show(
        'Fill in the required fields!',
        'warning'
      );
      return;
    }

    const compositions = this.form.value.compositions;

    const rawMaterialIds = compositions.map((c: any) => c.rawMaterialId);

    const hasDuplicates = new Set(rawMaterialIds).size !== rawMaterialIds.length;

    if (hasDuplicates) {
      this.toastService.show(
        'You added the same ingredient more than once! Please combine the quantities in a single item.',
        'warning'
      );
      return;
    }

    this.toastService.confirm(
      'Do you want to save this product?',
      () => this.executeSave()
    );
  }

  private executeSave() {

    const formValue = this.form.value;

    const data: ProductsFormModel = {
      id: this.selectedProduct?.id ?? null,
      code: this.selectedProduct?.code ?? null,
      name: formValue.name,
      price: formValue.price,

      compositions: formValue.compositions.map((c: any) => ({
        rawMaterial: { id: c.rawMaterialId },
        quantityRequired: c.quantityRequired,
        measure: c.measure
      }))
    };

    const isUpdate = data.id && data.id > 0;
    console.log(JSON.stringify(data, null, 2));
    const request = isUpdate
      ? this.productService.updateProduct(data.id!, data)
      : this.productService.saveProduct(data);

    request.subscribe({
      next: (result) => {

        this.toastService.show(
          isUpdate
            ? 'Product updated successfully!'
            : 'Product saved successfully!',
          'success'
        );

        this.selectedProduct = null;
        this.returnRegister.emit(result);
        this.form.reset();
        this.compositions.clear();
        this.addComposition();

        this.form.markAsPristine();
        this.form.markAsUntouched();
      },

      error: () => {
        this.toastService.show(
          isUpdate
            ? 'Error updating product!'
            : 'Error saving product!',
          'error'
        );
      }
    });
  }

  trackByIndex(index: number) {
    return index;
  }


}



