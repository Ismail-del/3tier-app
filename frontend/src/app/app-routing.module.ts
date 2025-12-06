import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeersListComponent } from './components/beers-list/beers-list.component';
import { AddBeerComponent } from './components/add-beer/add-beer.component';
import { BeerDetailComponent } from './components/beer-detail/beer-detail.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'add-beer' },
  { path: 'beers-list', component: BeersListComponent },
  { path: 'add-beer', component: AddBeerComponent },
  { path: 'edit-beer/:id', component: BeerDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
