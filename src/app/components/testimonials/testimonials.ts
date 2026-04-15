import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.css'],
  imports: [RouterLink, NgFor]
})
export class TestimonialsComponent implements OnInit {

  testimonials: any[] = [];

  ngOnInit(): void {
    this.testimonials = [
      {
        name: 'Rahul Sharma',
        message: 'STEP helped me improve my communication and confidence.'
      },
      {
        name: 'Anita Verma',
        message: 'The interview sessions were extremely useful.'
      },
      {
        name: 'Kiran Kumar',
        message: 'Great trainers and practical learning experience.'
      }
    ];
  }

}
