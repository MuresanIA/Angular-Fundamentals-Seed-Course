import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import "rxjs/add/operator/map";
import { Passenger } from "../../models/passenger.interface";
import { PassengerDashboardService } from "../../passenger-dashboard.service";

@Component({
  selector: "passenger-dashboard",
  styleUrls: ["passenger-dashboard.component.scss"],
  template: `<div>
    <passenger-count [items]="passengers"></passenger-count>
    <div *ngFor="let passenger of passengers">{{ passenger.fullname }}</div>
    <passenger-detail
      *ngFor="let passenger of passengers"
      [detail]="passenger"
      (view)="handleView($event)"
      (remove)="handleRemove($event)"
      (edit)="handleEdit($event)"
    ></passenger-detail>
  </div>`,
})
export class PassengerDashboardComponent implements OnInit, OnDestroy {
  passengers: Passenger[];
  private initSub: Subscription;

  constructor(
    private passengerService: PassengerDashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initSub = this.passengerService
      .getPassengers()
      .subscribe((data: Passenger[]) => (this.passengers = data));
  }

  ngOnDestroy(): void {
    this.initSub.unsubscribe();
  }

  handleRemove(event: Passenger) {
    this.passengerService
      .removePassenger(event)
      .subscribe((passenger: Passenger) => {
        this.passengers = this.passengers.filter(
          (passenger: Passenger) => passenger.id !== event.id
        );
      });
  }

  handleView(event: Passenger) {
    this.router.navigate(["/passengers", event.id]);
  }

  handleEdit(event: Passenger) {
    this.passengerService
      .updatePassenger(event)
      .subscribe((passenger: Passenger) => {
        this.passengers = this.passengers.map((passenger: Passenger) => {
          if (passenger.id === event.id) {
            passenger = Object.assign({}, passenger, event);
          }
          return passenger;
        });
      });
  }
}
