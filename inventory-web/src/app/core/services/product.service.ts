import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductsListModel } from '../../shared/models/products-list.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsFormModel } from '../../shared/models/products-form.model';
import { ProductionSimulationModel } from '../../shared/models/production-simulation.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  // Create
  saveProduct(data: ProductsFormModel) {
    return this.http.post<ProductsListModel>(`${this.API}/save`, data);
  }

  // List
  findAllProduct(): Observable<ProductsListModel[]> {
    return this.http.get<ProductsListModel[]>(`${this.API}/findAll`);
  }

  // Find By Id With Compositions
  findByIdProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/compositions/${id}`);
  }
  // Update
  updateProduct(id: number, data: ProductsFormModel) {
    return this.http.put<ProductsListModel>(`${this.API}/update/${id}`, data);
  }

  // Delete
  deleteProduct(id: number) {
    return this.http.delete(`${this.API}/delete/${id}`);
  }

  // Simulate
  simulate(data: { productId: number; quantity: number }): Observable<ProductionSimulationModel> {
    return this.http.post<ProductionSimulationModel>(`${this.API}/simulate`, data);
  }

}
