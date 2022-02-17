import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { EMPTY, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.scss'],
})
export class EditProductsComponent implements OnInit {
  disabled: boolean = true;
  isDelHidden: boolean = true;
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  productForm = this.formBuilder.group({
    id: [''],
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    type: ['', [Validators.required, Validators.maxLength(25)]],
    catID: [Math.floor(Math.random() * 10e10)],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    price: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
    featured: [true],
    active: [true],
  });

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params['id'] !== '0') {
            this.isDelHidden = false;
            return this.productService.get(params['id']);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe((product) => {
        delete product.category;
        this.productForm.setValue(product);
      });
  }

  onDelete() {
    let id = this.productForm.value.id;
    if (id) {
      this.productService.delete(id).subscribe(() => {
        this.router.navigate(['/products']);
        this.toastr.success('Product has been removed!', 'Success', {
          timeOut: 3000,
        });
      });
    }
  }

  onUpdate() {
    if (this.productForm.value.id) {
      this.productService.update(this.productForm.value).subscribe(() => {
        this.router.navigate(['/products']);
        this.toastr.success('Product has been updated!', 'Success', {
          timeOut: 3000,
        });
      });
    } else {
      this.productService.create(this.productForm.value).subscribe(() => {
        this.router.navigate(['/products']);
        this.toastr.success('Product has been added!', 'Success', {
          timeOut: 3000,
        });
      });
    }
  }
  goBack() {
    this.router.navigate(['/products']);
  }

  get name() {
    return this.productForm.get('name');
  }
  get type() {
    return this.productForm.get('type');
  }
  get description() {
    return this.productForm.get('description');
  }
  get price() {
    return this.productForm.get('price');
  }
}
