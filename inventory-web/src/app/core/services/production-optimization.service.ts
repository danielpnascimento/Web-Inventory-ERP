import { Injectable } from '@angular/core';
import { ProductionOptimizationModel } from '../../shared/models/production-optimization.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionOptimizationService {

  private API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  findAllProductionOptimization(): Observable<ProductionOptimizationModel> {
   return this.http.get<ProductionOptimizationModel>(`${this.API}/all-production-optimization`);
  }
}