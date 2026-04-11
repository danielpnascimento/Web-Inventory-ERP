import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RawMaterialsListModel } from '../../shared/models/raw-materials-list.model';
import { RawMaterialFormModel } from '../../shared/models/raw-material-form.model';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { ProductionOptimization } from '../../pages/production-optimization/production-optimization';
import { CsvService } from './csv.service';
import { ProductionSimulationModel } from '../../shared/models/production-simulation.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private API = `${environment.apiUrl}/raw-materials`;

  private materialsCache$ = new BehaviorSubject<RawMaterialsListModel[] | null>(null);

  constructor(private http: HttpClient,
    private csvService: CsvService) { }

  // Create
  saveMaterial(data: RawMaterialFormModel): Observable<RawMaterialsListModel> {
    if (environment.useMock) {
      const currentList = this.materialsCache$.getValue() || [];

      const nextId = currentList.length > 0 ? Math.max(...currentList.map(m => Number(m.id) || 0)) + 1 : 1;

      const codigoGerado = `RM${String(nextId).padStart(3, '0')}`;

      const novoMaterial: RawMaterialsListModel = {
        id: data.id || nextId,
        code: data.code || codigoGerado,
        name: data.name,
        quantityInStock: data.quantityInStock || 0,
        measure: data.measure
      };

      currentList.push(novoMaterial);

      this.materialsCache$.next(currentList);

      return of(novoMaterial);
    }

    return this.http.post<RawMaterialsListModel>(`${this.API}/save`, data);
  }


  // List
  findAllMaterial(): Observable<RawMaterialsListModel[]> {
    if (environment.useMock) {
      const cache = this.materialsCache$.getValue();

      if (cache !== null) {
        return of(cache);
      }
      return this.csvService.load('raw_materials').pipe(
        map(data => data.map(item => {
          const values = Object.values(item);
          return {
            id: Number(values[0]) || 0,
            code: String(values[1] || ''),
            name: String(values[2] || ''),
            quantityInStock: Number(values[3]) || 0,
            measure: String(values[4] || '')
          };
        })),
        tap(materiais => this.materialsCache$.next(materiais))
      );
    }
    return this.http.get<RawMaterialsListModel[]>(`${this.API}/findAll`);
  }


  // Find By Id
  findByIdMaterial(id: number): Observable<RawMaterialsListModel | any> {
    if (environment.useMock) {
      return this.findAllMaterial().pipe(
        map(materials => materials.find(m => Number(m.id) === Number(id)))
      );
    }
    return this.http.get<RawMaterialsListModel>(`${this.API}/raw-materials/${id}`);
  }

  // Update
  updateMaterial(id: number, data: RawMaterialFormModel) {
    if (environment.useMock) {
      const currentList = this.materialsCache$.getValue() || [];
      const index = currentList.findIndex(p => p.id === id);

      let updatedMaterial: RawMaterialsListModel;

      if (index !== -1) {
        updatedMaterial = {
          ...currentList[index],
          id: id,
          code: data.code,
          name: data.name,
          quantityInStock: data.quantityInStock || 0,
          measure: data.measure
        };
        currentList[index] = updatedMaterial;
        this.materialsCache$.next(currentList);
      } else {
        updatedMaterial = {
          id, code: data.code,
          name: data.name,
          quantityInStock: data.quantityInStock || 0,
          measure: data.measure
        };
      }
      return of(updatedMaterial);
    }
    return this.http.put<RawMaterialsListModel>(`${this.API}/raw-materials/${id}`, data);
  }

  // Delete
  deleteMaterial(id: number) {
    if (environment.useMock) {
      const currentList = this.materialsCache$.getValue() || [];
      const novaLista = currentList.filter(p => p.id !== id);
      this.materialsCache$.next(novaLista);
      return of(id);
    }
    return this.http.delete<number>(`${this.API}/raw-materials/${id}`);

  }

  // Simulate
  simulate(data: any): Observable<any> {
    if (environment.useMock) {
      console.log('Mock simulate', data);
      return of({} as ProductionSimulationModel);
    }
    return this.http.post<ProductionSimulationModel>(`${this.API}/products/simulate`, data);
  }


  // Optimization
  optimization(): Observable<ProductionOptimization> {
    return this.http.get<ProductionOptimization>(
      `${this.API}/products/production-optimization`
    );
  }


}
