import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProductService } from './../../service/product.service';
import { Product } from 'src/app/model/product';
import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  scrollObserver: IntersectionObserver | undefined;
  loadedElements: number = 10;
  searchKey: string = 'name';
  keyword: string = '';
  keywordMin: string = '';
  keywordMax: string = '';

  allProducts$: Observable<Product[]> = this.productService.getAll().pipe(
    tap((products) => {
      products.forEach((product) => {
        this.IDCounter = products.length;
      });

      this.scrollObserver = new IntersectionObserver(
        ([entry]: IntersectionObserverEntry[]) => {
          if (entry.isIntersecting) {
            this.loadedElements = this.loadedElements + 10;
          }
          if (this.loadedElements > products.length) {
            this.scrollObserver?.disconnect();
          }
        }
      );
      this.scrollObserver.observe(document.querySelector('#scrollAnchor')!);
    })
  );
  productKeys: string[] = Object.keys(new Product());

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}
  /*constructor(
    private pService: ProductService, private router: Router) {
    this.sumPrice()
    this.countID()
  }*/

  ngOnInit(): void {
    this.productKeys[3] = 'category name';
    this.productKeys.length = 8;
    //total numbers in initialization
    this.allProducts$.subscribe(
      products => {
        products.forEach(product => {
          this.sumPriceCounter += product.price
        })
        products.forEach(product => {
          this.IDCounter++
        })
      }
    )
  }

  sortKey: string = '';
  sortDirection: string = 'A...Z';
  clickCounter: number = 0;

  sorting(key: string): void {
    key === this.sortKey ? this.clickCounter++ : (this.clickCounter = 0);
    this.sortDirection = this.clickCounter % 2 ? 'Z...A' : 'A...Z';
    this.sortKey = key;
  }

  clearKeyword(): void {
    this.keyword = '';
  }

  clearKeywordMinMax(): void {
    this.keywordMin = ''
    this.keywordMax = ''
    //this.total()
  }

  total():void {
    this.sumPrice()
    this.countID()
  }

  sumPriceCounter: number = 0
  sumPrice(): void {
    this.allProducts$.subscribe(
      products => {
        this.sumPriceCounter = 0
        let priceTds = document.querySelectorAll('.price')
        priceTds.forEach(td => {
          this.sumPriceCounter += Number(td.innerHTML)
        })
      }
    )
  }

  IDCounter: number = 0
  countID(): void {
    this.allProducts$.subscribe(
      products => {
        this.IDCounter = 0
        let tds = document.querySelectorAll('tr')
        tds.forEach(td => {
          this.IDCounter++
        })
        this.IDCounter = this.IDCounter - 2
      }
    )
  }

  onDelete(productID: number): void {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.productService.delete(productID).subscribe(() => {
      this.toastr.success('Product has been removed!', 'Success', {
        timeOut: 3000,
      });
      this.allProducts$ = this.productService.getAll();
    });
  }
}

