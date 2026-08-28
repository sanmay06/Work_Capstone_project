import { Component, OnInit, signal } from '@angular/core';
import { ItemService } from './item.service';
import { Item } from './item.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss'
})
export class ItemList implements OnInit {
  items = signal<Item[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load items — is the backend running?');
        this.loading.set(false);
      }
    });
  }
}
