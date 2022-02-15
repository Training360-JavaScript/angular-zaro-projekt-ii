import { ProductService } from './../../service/product.service';
import { Product } from 'src/app/model/product';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    private pService: ProductService
  ) {
  }

  allProducts$: Observable<Product[]> = this.pService.getAll()
  productKeys: string[] = Object.keys(new Product())

  searchKey: string = 'name'
  keyword: string = ''
  keywordMin: string = ''
  keywordMax: string = ''

  ngOnInit(): void {

  }

  console():void {
    console.log(this.searchKey)
    console.log(this.keywordMin)
    console.log(this.keywordMax)
  }

  clearKeyword():void {
    this.keyword = ''
    this.console()
  }

  clearKeywordMinMax():void {
    this.keywordMin = ''
    this.keywordMax = ''
  }

  onDelete(product: Product): void {
    if (!confirm('Are you sure?')) { return } //confirm ablakkal könnyen megvalósítható a biztonsági kérdés
    this.pService.delete(product.id)
  }

}
