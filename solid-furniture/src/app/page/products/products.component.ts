import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    private pService: ProductService
  ) { }

  allProducts$: Observable<Product[]> = this.pService.getAll();
  searchCategory: string = ''
  keyword: string = ''

  ngOnInit(): void {
  }

  onDelete(product: Product): void {
    if (!confirm('Are you sure?')) { return } //confirm ablakkal könnyen megvalósítható a biztonsági kérdés
    this.pService.delete(product.id)
  }

}
