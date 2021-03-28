import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandler } from 'src/app/common/error-handler';
import { LeatherSelectComponent } from 'src/app/order/components/checkout-page/leather-select.component';
import { takeUntil } from 'rxjs/operators';
import { LeatherFormBottomSheetData, LeatherSelectResult } from 'src/app/order/order.model';
import { Subject } from 'rxjs';
import { fromEntries } from 'src/app/common/const';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-leather-form',
  template: `
      <ng-container *transloco="let t">
          <mat-card class="mat-elevation-z2"><h3>{{t('select leathers message')}}</h3></mat-card>
          <form [formGroup]="leatherForm" class="vertical-form">
              <div class="leather-select-group">

                  <!-- Inner Leather -->
                  <br *ngIf="leatherForm.contains('inner_leather')">
                  <div *ngIf="leatherForm.contains('inner_leather')" class="leather-select"
                       (click)="openLeatherSelection('inner_leather')">
                      <mat-form-field color="primary" appearance="outline" class="cursor-pointer">
                          <mat-label>{{t('inner_leather')}}</mat-label>
                          <input type="text" matInput class="cursor-pointer"
                                 readonly formControlName="inner_leather_str">
                          <mat-error>{{errors.inner_leather}}</mat-error>
                      </mat-form-field>
                      <img [src]="leatherForm.value.inner_leather_img"
                           [alt]="leatherForm.value.inner_leather_img | imageAlt"
                           class="leather-image cursor-pointer">
                  </div>

                  <!-- Outer Leather -->
                  <br *ngIf="leatherForm.contains('outer_leather')">
                  <div *ngIf="leatherForm.contains('outer_leather')" class="leather-select"
                       (click)="openLeatherSelection('outer_leather')">
                      <mat-form-field color="primary" appearance="outline" class="cursor-pointer">
                          <mat-label>{{t('outer_leather')}}</mat-label>
                          <input type="text" matInput class="cursor-pointer"
                                 readonly formControlName="outer_leather_str">
                          <mat-error>{{errors.outer_leather}}</mat-error>
                      </mat-form-field>
                      <img [src]="leatherForm.value.outer_leather_img"
                           [alt]="leatherForm.value.outer_leather_img | imageAlt"
                           class="leather-image cursor-pointer">
                  </div>
              </div>

              <br>
              <button mat-raised-button color="primary" (click)="submit()" style="width: 100%">
                  <span class="flex-center">
                      <mat-icon>check</mat-icon>&nbsp;
                      {{t('select')}}
                  </span>
              </button>
          </form>
      </ng-container>
  `,
  styles: [`
      .leather-select-group {
          width: 80%;
          display: flex;
          flex-direction: column;
      }

      .leather-select {
          width: 100%;
          display: flex;
          flex-direction: row;
      }

      .leather-select > mat-form-field {
          width: 85%;
      }

      .leather-image {
          width: 15%;
          border-radius: 4px;
          border: 3px solid rgba(27, 163, 30, 0.6);
          margin-left: 10px;
      }

      .cursor-pointer {
          cursor: pointer;
      }

      @media only screen and (max-width: 800px) {
          .leather-select > mat-form-field {
              width: 75%;
          }

          .leather-image {
              width: 25%;
          }
      }

      @media only screen and (max-width: 450px) {
          .leather-select > mat-form-field {
              width: 65%;
          }

          .leather-image {
              width: 35%;
          }
      }
  `]
})
export class LeatherFormComponent implements OnInit {

  leatherForm: FormGroup;
  errors: any = {};
  uns$ = new Subject();


  constructor(
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    private errorHandler: ErrorHandler,
    @Inject(MAT_DIALOG_DATA) public data: LeatherFormBottomSheetData,
    private dialogRef: MatDialogRef<LeatherFormComponent>,
  ) { }


  ngOnInit(): void {
    this.leatherForm = this.getLeatherForm();
    this.errorHandler.handleErrors(this.leatherForm, this.errors);
  }


  getLeatherForm() {
    if (this.data.product.category.name.toLowerCase() === 'accessory') {
      return this.getAccessoryLeatherForm();
    }
    return this.getTableLeatherForm();
  }


  getAccessoryLeatherForm() {
    return this.fb.group({
      outer_leather: [null, [Validators.required]],
      outer_leather_str: '',
      outer_leather_img: '../../../assets/images/white.png',
    });
  }


  getTableLeatherForm() {
    return this.fb.group({
      inner_leather: [null, [Validators.required]],
      inner_leather_str: '',  // helper field
      inner_leather_img: '../../../assets/images/white.png', // helper field
      outer_leather: [null, [Validators.required]],
      outer_leather_str: '',
      outer_leather_img: '../../../assets/images/white.png',
    });
  }


  openLeatherSelection(identifier: 'inner_leather' | 'outer_leather') {
    const data = {leathersSerials: this.data.leathersSerials, identifier};

    this.bottomSheet.open(LeatherSelectComponent, {data})
      .afterDismissed()
      .pipe(takeUntil(this.uns$))
      .subscribe((result: LeatherSelectResult | undefined) => {
        if (result?.leather?.id) {
          this.patchLeather(identifier, result);
        }
      });
  }


  patchLeather(identifier: 'inner_leather' | 'outer_leather', result: LeatherSelectResult) {
    const entries = fromEntries([
      [identifier, result.leather.id],
      [`${identifier}_str`, `${result.leatherSerial.name} ${result.leather.code.toUpperCase()}`],
      [`${identifier}_img`, result.leather.image]
    ]);
    this.leatherForm.patchValue(entries);
  }


  submit() {
    if (this.leatherForm.invalid) {
      this.leatherForm.markAllAsTouched();
      this.leatherForm.markAsDirty();
      return;
    }

    this.dialogRef.close(this.leatherForm.value);
  }

}
