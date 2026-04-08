import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductionSimulationModel } from '../../shared/models/production-simulation.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionSimulationService {

  private API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  simulate(productId: number, quantity: number): Observable<ProductionSimulationModel> {
    return this.http.get<ProductionSimulationModel>(
      `${this.API}/simulate/${productId}`,
      { params: { quantity } }
    );
  }

}
