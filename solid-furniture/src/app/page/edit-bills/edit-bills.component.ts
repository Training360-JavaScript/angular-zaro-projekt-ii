import { Component, OnInit } from '@angular/core';

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

}
