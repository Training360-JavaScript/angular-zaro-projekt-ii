import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule, routerComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { HeaderComponent } from './common/header/header.component';
import { TestComponent } from './page/test/test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './pipe/filter.pipe';
import { ToastrModule } from 'ngx-toastr';
import { SorterPipe } from './pipe/sorter.pipe';
import { TextcutterPipe } from './pipe/textcutter.pipe';

import { LoadPipe } from './pipe/load.pipe';
import { LoadingComponent } from './common/loading/loading.component';
import { SumPipe } from './pipe/sum.pipe';

@NgModule({
  declarations: [
    routerComponents,
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    TestComponent,
    FilterPipe,
    SorterPipe,
    TextcutterPipe,
    LoadPipe,
    LoadingComponent,
    SumPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
