import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Card } from '../models/card';
import { Payment } from '../models/payment';
import { Rental } from '../models/rental';
import { ResponseModel } from '../models/responseModel';
import { CardService } from './card.service';
import { RentalService } from './rental.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  apiUrl: string = 'https://localhost:44375/api/';
  totalPrice: number;
  rentals: Rental;
  cardSavedRequest: boolean;
  payment: Payment;
  cardModel: Card;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private rentalService: RentalService,
    private cardService: CardService,
    private toastrService:ToastrService
  ) {}

  addPayment(payment: Payment): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'payments/add';
    return this.httpClient.post<ResponseModel>(newPath, payment);
  }

  addRentalAfterPaymentAndCardInfoCompleted() {
    console.log(this.cardSavedRequest)
    if (this.cardSavedRequest === true) {
      this.cardService.add(this.cardModel).subscribe(response => {
        this.addPayment(this.payment).subscribe(response => {
          this.rentalService.addRental(this.rentals).subscribe(response => {
            this.toastrService.success('Success.');
            this.router.navigate(["/cardetails"])

          }, responseError => {
            this.toastrService.error(responseError.errors, 'You do not have enough Findex points to rent this car.');
          });
        });
      }, responseError => {
        this.toastrService.error('Invalid credit card informations.');
      });
    }else{
      console.log(this.payment)
      this.addPayment(this.payment).subscribe(response => {
        this.rentalService.addRental(this.rentals).subscribe(response => {
          this.toastrService.success('Success.');
          this.router.navigate(["/cardetails"])
          this.toastrService.success("Ödeme başarılı")
        }, responseError => {
          this.toastrService.error(responseError.errors, 'You do not have enough Findex points to rent this car.');
        });
      })
    }
  } 

  
}