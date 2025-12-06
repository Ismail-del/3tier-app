import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../service/crud.service';

@Component({
  selector: 'app-beers-list',
  templateUrl: './beers-list.component.html',
  styleUrls: ['./beers-list.component.scss'],
})
export class BeersListComponent implements OnInit {
  Beers: any = [];

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.crudService.GetBeers().subscribe((res: any) => {
      console.log(res);
      this.Beers = res;
    });
  }

  delete(id: any, i: any) {
    console.log(id);
    if (window.confirm('Do you want to go ahead?')) {
      this.crudService.deleteBeer(id).subscribe(() => {
        this.Beers.splice(i, 1);
      });
    }
  }
}
