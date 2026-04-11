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
      // Split by comma, but ignore commas inside double quotes
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      // Remove surrounding quotes and trim spaces
      return values.map(v => v.replace(/^"|"$/g, '').trim());
    });
  }
}