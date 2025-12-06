import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AddBeerComponent } from './components/add-beer/add-beer.component';
import { BeerDetailComponent } from './components/beer-detail/beer-detail.component';
import { BeersListComponent } from './components/beers-list/beers-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AddBeerComponent,
    BeerDetailComponent,
    BeersListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
