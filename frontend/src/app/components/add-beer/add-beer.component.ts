import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../service/crud.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-beer',
  templateUrl: './add-beer.component.html',
  styleUrls: ['./add-beer.component.scss'],
})
export class AddBeerComponent implements OnInit {
  beerForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private crudService: CrudService
  ) {
    this.beerForm = this.formBuilder.group({
      name: [''],
      rate: [''],
    });
  }

  ngOnInit() {}

  onSubmit(): any {
    this.crudService.AddBeer(this.beerForm.value).subscribe(
      () => {
        console.log('Data added successfully!');
        this.ngZone.run(() => this.router.navigateByUrl('/beers-list'));
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
