import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-edit-bills',
  templateUrl: './edit-bills.component.html',
  styleUrls: ['./edit-bills.component.scss']
})
export class EditBillsComponent implements OnInit {

  constructor(
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
  }

  allCategory$: Observable<Category[]> = this.categoryService.getAll();

}
