import { Component, OnInit } from '@angular/core';
import { NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.html',
  styleUrls: ['./courses.css'],
  imports: [NgFor, NgClass, AsyncPipe]
})
export class CoursesComponent implements OnInit {

  courses$!: Observable<any[]>;

  ngOnInit(): void {
    this.courses$ = of([
      { title: 'Communication Skills', duration: '4 Weeks' },
      { title: 'Personality Development', duration: '6 Weeks' },
      { title: 'Interview Preparation', duration: '3 Weeks' }
    ]);
  }

}
