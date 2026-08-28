import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './item.model';
import { API_BASE_URL } from '../../../core/api';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private apiUrl = `${API_BASE_URL}/items`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  create(item: { name: string; description: string; categoryId: string; assetTag: string }): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }
}
