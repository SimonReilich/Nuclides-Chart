import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { DataEntry } from '../models/nuclid.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NuclidService {
  private dataIndex = new Map<string, DataEntry>();
  
  constructor(private http: HttpClient) {}

  async loadData(filePath: string): Promise<void> {
    const csvData = await firstValueFrom(
      this.http.get(filePath, { responseType: 'text' })
    );

    const parsed = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });

    const entries = parsed.data as DataEntry[];

    this.dataIndex.clear();
    entries.forEach(entry => {
      const key = `${entry.z}_${entry.n}`;
      this.dataIndex.set(key, entry);
    });
    
    console.log(`Indexed ${this.dataIndex.size} entries.`);
  }

  get(z: number, n: number): DataEntry | undefined {
    const key = `${z}_${n}`;
    return this.dataIndex.get(key);
  }
}