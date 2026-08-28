import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { ItemService } from '../../catalog/item-list/item.service';
import { Item } from '../../catalog/item-list/item.model';

@Component({
  selector: 'app-manage-catalog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-catalog.html',
  styleUrl: './manage-catalog.css'
})
export class ManageCatalog implements OnInit {
  private categoryService = inject(CategoryService);
  private itemService = inject(ItemService);

  categories = signal<Category[]>([]);
  items = signal<Item[]>([]);

  categoryName = '';
  maxLoanDurationDays = 7;
  depositRequired = false;
  categoryResult = signal<string | null>(null);

  itemName = '';
  itemDescription = '';
  itemCategoryId = '';
  itemAssetTag = '';
  itemResult = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.categoryService.getAll().subscribe(data => this.categories.set(data));
    this.itemService.getAll().subscribe(data => this.items.set(data));
  }

  submitCategory(): void {
    this.categoryService.create(this.categoryName, this.maxLoanDurationDays, this.depositRequired).subscribe({
      next: () => {
        this.categoryResult.set('Category created.');
        this.categoryName = '';
        this.refresh();
      },
      error: (err: any) => this.categoryResult.set(err.error?.error || 'Failed to create category.')
    });
  }

  submitItem(): void {
    this.itemService.create({
      name: this.itemName,
      description: this.itemDescription,
      categoryId: this.itemCategoryId,
      assetTag: this.itemAssetTag
    }).subscribe({
      next: () => {
        this.itemResult.set('Item created.');
        this.itemName = '';
        this.itemAssetTag = '';
        this.refresh();
      },
      error: (err: any) => this.itemResult.set(err.error?.error || 'Failed to create item.')
    });
  }
}