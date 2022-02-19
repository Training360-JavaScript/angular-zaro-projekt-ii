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
  IDCounter: number = 0;

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
  productKeys: string[] = Object.keys(new Product()); // Inkább manuálisan vidd be, mert van egy új ?-es kúlcs is a Product()-ban, amit nem kellene megjeleníteni. És a catID helyett most a kategórianevek szerepelnek.

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.productKeys[3] = 'category name';
    this.productKeys.length = 8;
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
    console.log(this.productKeys);
  }

  clearKeywordMinMax(): void {
    this.keywordMin = '';
    this.keywordMax = '';
  }

  sumPriceCounter: number = 0;
  sumPrice(): void {
    /*
    // Select the node that will be observed for mutations
const targetNode = document.getElementById('some-id');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

    let observer = new MutationObserver((mutations) => {
      console.log(observer)
      mutations.forEach((mutation) => {
        console.log(observer)
        if (!mutation.addedNodes) return

        for (let i = 0; i < mutation.addedNodes.length; i++) {
          let node = mutation.addedNodes[i]
          console.log(observer)
          console.log(node)
        }
      })
    })
*/

    /*
return new Promise((resolve, reject) => {
  let el = document.querySelector(selector);
  if (el) {
    resolve(el);
    return
  }
  new MutationObserver((mutationRecords, observer) => {
    // Query for elements matching the specified selector
    Array.from(document.querySelectorAll(selector)).forEach((element) => {
      resolve(element);
      //Once we have resolved we don't need the observer anymore.
      observer.disconnect();
    });
  })
    .observe(document.documentElement, {
      childList: true,
      subtree: true
    })
})
*/

    this.allProducts$.subscribe((products) => {
      let priceTds = document.querySelectorAll('#price');
      console.log(priceTds);
    });
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
