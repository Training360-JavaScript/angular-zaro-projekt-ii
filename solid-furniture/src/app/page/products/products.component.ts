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

  ngOnInit(): void {
  }

}
