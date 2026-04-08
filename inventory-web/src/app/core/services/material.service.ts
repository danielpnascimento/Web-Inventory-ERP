import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RawMaterialsListModel } from '../../shared/models/raw-materials-list.model';
import { RawMaterialFormModel } from '../../shared/models/raw-material-form.model';
import { Observable } from 'rxjs';
import { ProductionOptimization } from '../../pages/production-optimization/production-optimization';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private API = `${environment.apiUrl}/raw-materials`;

  constructor(private http: HttpClient) { }

  // Create
  saveMaterial(data: RawMaterialFormModel) {
    return this.http.post<RawMaterialsListModel>(`${this.API}/save`, data);
  }

  // List
  findAllMaterial(): Observable<RawMaterialsListModel[]> {
    return this.http.get<RawMaterialsListModel[]>(`${this.API}/findAll`);
  }

  // Find By Id
  findByIdMaterial(id: number): Observable<RawMaterialsListModel> {
    return this.http.get<RawMaterialsListModel>(`${this.API}/findById/${id}`);
  }

  // Update
  updateMaterial(id: number, data: RawMaterialFormModel) {
    return this.http.put<RawMaterialsListModel>(`${this.API}/update/${id}`, data);
  }

  // Delete
  deleteMaterial(id: number) {
    return this.http.delete(`${this.API}/delete/${id}`);
  }

  // Simulate
  simulate(data: any): Observable<any> {
    return this.http.post(
      `${this.API}/products/simulate`,
      data
    );
  }

  // Optimization
  optimization(): Observable<ProductionOptimization> {
    return this.http.get<ProductionOptimization>(
      `${this.API}/products/production-optimization`
    );
  }


}
