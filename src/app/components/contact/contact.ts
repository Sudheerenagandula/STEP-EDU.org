import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  imports: [ReactiveFormsModule]
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      interest: [''],
      message: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      alert('Message sent successfully!');
      this.contactForm.reset();
    }
  }
}
