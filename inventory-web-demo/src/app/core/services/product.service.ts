import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductsListModel } from '../../shared/models/products-list.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { ProductsFormModel } from '../../shared/models/products-form.model';
import { ProductionSimulationModel } from '../../shared/models/production-simulation.model';
import { CsvService } from './csv.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API = `${environment.apiUrl}/products`;

  private productsCache$ = new BehaviorSubject<ProductsListModel[] | null>(null);

  constructor(private http: HttpClient,

    private csvService: CsvService) { }

  // Create
  saveProduct(data: ProductsFormModel): Observable<ProductsListModel> {
    if (environment.useMock) {
      const currentList = this.productsCache$.getValue() || [];

      const nextId = currentList.length > 0 ? Math.max(...currentList.map(p => Number(p.id) || 0)) + 1 : 1;
      const codigoGerado = `Prod${String(nextId).padStart(3, '0')}`;

      const novoProduto: ProductsListModel = {
        id: nextId,
        code: data.code || codigoGerado,
        name: data.name,
        price: data.price
      };

      currentList.push(novoProduto);

      this.productsCache$.next(currentList);

      return of(novoProduto);
    }

    return this.http.post<ProductsListModel>(`${this.API}/save`, data);
  }


  // List
  findAllProduct(): Observable<ProductsListModel[]> {
    if (environment.useMock) {
      const cache = this.productsCache$.getValue();

      if (cache !== null) {
        return of(cache);
      }
      return this.csvService.load('products').pipe(
        map(data => data.map(item => {
          const values = Object.values(item);
          return {
            id: Number(values[0]) || 0,
            code: String(values[1] || ''),
            name: String(values[2] || ''),
            price: Number(values[3]) || 0
          };
        })),
        tap(produtos => this.productsCache$.next(produtos))
      );
    }
    return this.http.get<ProductsListModel[]>(`${this.API}/findAll`);
  }

  // Find By Id With Compositions
  findByIdProduct(id: number): Observable<any> {
    if (environment.useMock) {
      return this.findAllProduct().pipe(
        map(products => products.find(p => Number(p.id) === Number(id))),
        switchMap(product => {
          if (!product) return of(null);
          return this.csvService.load('product_compositions').pipe(
            map(comps => comps
              .map(c => {
                const values = Object.values(c);
                return {
                  id: Number(values[0]) || 0,
                  quantityRequired: Number(values[1]) || 0,
                  productId: Number(values[2]) || 0,
                  rawMaterial: { id: Number(values[3]) || 0 },
                  measure: String(values[4] || '')
                };
              })
              .filter(c => Number(c.productId) === Number(id))
            ),
            map(compositions => ({
              ...product,
              compositions
            }))
          );
        })
      );
    }
    return this.http.get<any>(`${this.API}/product-compositions/${id}`);
  }

  // Update
  updateProduct(id: number, data: ProductsFormModel): Observable<ProductsListModel> {
    if (environment.useMock) {
      const currentList = this.productsCache$.getValue() || [];
      const index = currentList.findIndex(p => p.id === id);

      let updatedProduct: ProductsListModel;

      if (index !== -1) {
        updatedProduct = { ...currentList[index], code: data.code, name: data.name, price: data.price };
        currentList[index] = updatedProduct;
        this.productsCache$.next(currentList);
      } else {
        updatedProduct = { id, code: data.code, name: data.name, price: data.price };
      }
      return of(updatedProduct);
    }
    return this.http.put<ProductsListModel>(`${this.API}/update/${id}`, data);
  }

  // Delete
  deleteProduct(id: number): Observable<number> {
    if (environment.useMock) {
      const currentList = this.productsCache$.getValue() || [];
      const novaLista = currentList.filter(p => p.id !== id);
      this.productsCache$.next(novaLista);
      return of(id);
    }
    return this.http.delete<number>(`${this.API}/delete/${id}`);
  }

  // Simulate
  simulate(data: { productId: number; quantity: number }): Observable<ProductionSimulationModel> {
    if (environment.useMock) {
      console.log('Mock simulate', data);
      return of({} as ProductionSimulationModel);
    }
    return this.http.post<ProductionSimulationModel>(`${this.API}/simulate`, data);
  }

}
