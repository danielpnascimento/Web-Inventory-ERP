import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductionMaximumModel } from '../../shared/models/production-maximum.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionMaximumService {

  private API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  findAllProductionMaximum(): Observable<ProductionMaximumModel[]> {
    return this.http.get<ProductionMaximumModel[]>(`${this.API}/all-maximum-production`);
  }
}
