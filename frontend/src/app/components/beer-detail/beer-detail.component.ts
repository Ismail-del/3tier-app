import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../../service/crud.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-beer-detail',
  templateUrl: './beer-detail.component.html',
  styleUrls: ['./beer-detail.component.scss'],
})
export class BeerDetailComponent implements OnInit {
  getId: any;
  updateForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.crudService.GetBeer(this.getId).subscribe((res: { [x: string]: any; }) => {
      this.updateForm.setValue({
        firstName: res['name'],
        lastName: res['rate'],
      });
    });

    this.updateForm = this.formBuilder.group({
      name: [''],
      rate: [''],
    });
  }

  ngOnInit() {}

  onUpdate(): any {
    this.crudService.updateBeer(this.getId, this.updateForm.value).subscribe(
      () => {
        console.log('Data updated successfully!');
        this.ngZone.run(() => this.router.navigateByUrl('/beers-list'));
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
