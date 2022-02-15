import { Router } from '@angular/router';
import { ProductService } from './../../service/product.service';
import { Product } from 'src/app/model/product';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  allProducts$: Observable<Product[]> = this.pService.getAll()
  productKeys: string[] = Object.keys(new Product())
  searchKey: string = 'name'
  keyword: string = ''
  keywordMin: string = ''
  keywordMax: string = ''

  constructor(
    private pService: ProductService, private router: Router) {
      this.sumPrice()
      this.countID()
    }

  ngOnInit(): void { }

  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;

  sorting(key: string): void {
    (key === this.sortKey) ? this.clickCounter++ : this.clickCounter = 0;
    this.sortDirection = (this.clickCounter % 2) ? 'Z...A' : 'A...Z';
    this.sortKey = key;
  }

  clearKeyword(): void {
    this.keyword = ''
  }

  clearKeywordMinMax(): void {
    this.keywordMin = ''
    this.keywordMax = ''
  }

  sumPriceCounter: number = 0
  sumPrice(): void {
    this.allProducts$.subscribe(
      products => {
        products.forEach(product => {
          this.sumPriceCounter += product.price
        })
      }
    )
  }

  IDCounter: number = 0
  countID(): void {
    this.allProducts$.subscribe(
      products => {
        products.forEach(product => {
          this.IDCounter ++
        })
      }
    )
  }

  onDelete(productID: number): void {
    if (!confirm('Are you sure?')) { return }

    this.pService.delete(productID).subscribe(() => {
      this.allProducts$ = this.pService.getAll()
    })
  }

}


  //How ID nav works GERGO ADDED
/*
addProduct() {
  this.router.navigate(['/edit-products', 0]);

}
CORRESPONDING HTML SNIPPET
(click)="createProduct()

deleteProduct(id: number) {
  this.pService.delete(id).subscribe(() => {
    this.allProducts$ = this.pService.getAll();
  });
}
CORRESPONDING HTML SNIPPET
 <button (click)="deleteProduct(product.id)"
 Edit button is the same
*/
