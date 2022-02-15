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
    private pService: ProductService, private router: Router) { }

  ngOnInit(): void { }


  icon: number = 0;
  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;

  sorting(key: string):void {
    if (key) {console.log(key)}
    (key === this.sortKey) ? this.clickCounter++ : this.clickCounter = 0;
    this.sortDirection = (this.clickCounter % 2) ? 'Z...A' : 'A...Z';
    this.sortKey = key;

    if (key === 'name') this.icon = (this.sortDirection === 'A...Z') ? 1 : 2;
    if (key === 'stock') this.icon = (this.sortDirection === 'A...Z') ? 3 : 4;
    if (key === 'price') this.icon = (this.sortDirection === 'A...Z') ? 5 : 6;

  }


  console(): void {
    console.log(this.searchKey)
    console.log(this.keywordMin)
    console.log(this.keywordMax)
  }

  clearKeyword(): void {
    this.keyword = ''
    this.console()
  }

  clearKeywordMinMax(): void {
    this.keywordMin = ''
    this.keywordMax = ''
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
