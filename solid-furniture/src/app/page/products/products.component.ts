import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/model/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(private pService: ProductService, private router: Router) {}

  allProducts$: Observable<Product[]> = this.pService.getAll();

  addProduct() {
    this.router.navigate(['/products', 0]);
  }

  deleteProduct(id: number) {
    this.pService.delete(id).subscribe(() => {
      this.allProducts$ = this.pService.getAll();
    });
  }

  ngOnInit(): void {}
}
