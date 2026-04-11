import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialService } from '../../../core/services/material.service';
import { RawMaterialFormModel } from '../../../shared/models/raw-material-form.model';
import { RawMaterialsListModel } from '../../../shared/models/raw-materials-list.model';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { MeasurementTableCup } from '../measurement-table-cup/measurement-table-cup';

@Component({
  selector: 'app-raw-material-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MeasurementTableCup],
  templateUrl: './raw-material-form.html',
  styleUrls: ['./raw-material-form.scss'],
})
export class RawMaterialForm {

  @Input() selectedMaterial: RawMaterialFormModel | null = null;
  @Output() retorno = new EventEmitter<RawMaterialsListModel>();

  router = inject(ActivatedRoute);
  materialService = inject(MaterialService);

  measures = [
    { text: 'UN', value: 'UN' },
    { text: 'G', value: 'G' },
    { text: 'ML', value: 'ML' }
  ];

  showTableMeasurements = false;

  toggleTableMeasurements() {
    this.showTableMeasurements = !this.showTableMeasurements;
  }

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      quantityInStock: ['', [Validators.required, Validators.min(1)]],
      measure: [null]
    });

    this.form.valueChanges.subscribe(value => {
      if (value.measure === 'UN' && value.quantityInStock !== null && value.quantityInStock !== '') {
        const num = Number(value.quantityInStock);

        if (!Number.isInteger(num)) {
          const intValue = Math.floor(num);

          this.form.get('quantityInStock')?.setValue(intValue, { emitEvent: false });
        }
      }
    });
  }

  ngOnChanges() {
    this.showTableMeasurements = false;
    if (!this.form) return;

    if (this.selectedMaterial?.id) {
      this.form.patchValue(this.selectedMaterial);
    }
    else {
      this.form.reset();
    }
  }

  save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      this.toastService.show(
        'Fill in the required fields!',
        'warning'
      );
      return;
    }

    this.toastService.confirm(
      'Do you want to save this material?',
      () => this.executeSave()
    );
  }
  private executeSave() {
    const data: RawMaterialFormModel = {
      ...(this.selectedMaterial || {}),
      ...this.form.value
    };

    const isUpdate = data.id && data.id > 0;
    const request = isUpdate
      ? this.materialService.updateMaterial(data.id!, data)
      : this.materialService.saveMaterial(data);

    request.subscribe({
      next: (result) => {

        this.toastService.show(
          isUpdate
            ? 'Material successfully updated!'
            : 'Material saved successfully!',
          'success'
        );

        this.selectedMaterial = null;
        this.retorno.emit(result);
        this.form.reset();
      },

      error: () => {
        this.toastService.show(
          isUpdate
            ? 'Error updating material!'
            : 'Error saving material!',
          'error'
        );
      }
    });

  }


}
