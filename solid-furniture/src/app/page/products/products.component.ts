import { ToastrService } from 'ngx-toastr';
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

  productKeys: string[] = Object.keys(new Product());
  searchKey: string = 'name'
  keyword: string = ''
  keywordMin: string = ''
  keywordMax: string = ''
  sortKey: string = ''
  sortDirection: string = 'A...Z'
  clickCounter: number = 0
  IDCounter: number = 0
  sumPriceCounter: number = 0
  allProductsForTotal$: Observable<Product[]> = this.productService.getAll()
  scrollObserver: IntersectionObserver | undefined;
  loadedElements: number = 10;
  stillLoading: boolean = true

  allProducts$: Observable<Product[]> = this.productService.getAll().pipe(
    tap((products) => {
      /*
      customers.forEach((customer) => {
        this.IDCounter = customers.length;
      });*/

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

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.productKeys[3] = 'category name';
    this.productKeys.length = 8;
    //total numbers in initialization
    this.allProductsForTotal$.subscribe(
      products => {
        products.forEach(product => {
          this.sumPriceCounter += product.price
          this.IDCounter++
        })
        this.stillLoading = false
      }
    )
  }

  sorting(key: string): void {
    key === this.sortKey ? this.clickCounter++ : (this.clickCounter = 0);
    this.sortDirection = this.clickCounter % 2 ? 'Z...A' : 'A...Z';
    this.sortKey = key;
  }

  clearKeyword(): void {
    this.keyword = '';
    this.total()
  }

  clearKeywordMinMax(): void {
    this.keywordMin = ''
    this.keywordMax = ''
    this.total()
  }

 total(): void {
    this.allProductsForTotal$.subscribe(
      products => {
        this.sumPriceCounter = 0
        let priceTds = document.querySelectorAll('.price')
        priceTds.forEach(td => {
          this.sumPriceCounter += Number(td.innerHTML)
          this.IDCounter++
        })
      }
    )
  }

  onDelete(productID: number): void {
    if (!confirm('Are you sure?')) {
      return
    }

    this.productService.delete(productID).subscribe(() => {
      this.toastr.success('Product has been removed!', 'Success', {
        timeOut: 3000,
      });
      this.allProducts$ = this.productService.getAll();
    });
  }
}

