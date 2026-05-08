import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http: HttpClient) { }

  load(entity: string): Observable<any[]> {
    return this.http.get(`assets/data/${entity}.csv`, { responseType: 'text' })
      .pipe(
        map(data => this.parseCSV(data))
      );
  }

  private parseCSV(data: string): any[] {
    const lines = data.split('\n').filter(l => l.trim() !== '');

    return lines.map(line => {
      // Separe por vírgula, mas ignore as vírgulas dentro das aspas duplas.
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      // Remove as aspas duplas circundantes e recorta os espaços
      return values.map(v => v.replace(/^"|"$/g, '').trim());
    });
  }
}