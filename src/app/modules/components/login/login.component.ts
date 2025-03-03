import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  onSubmit() {

    if (this.loginForm.invalid) {
      const loginData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      // API call
      this.http.post<{ token: string }>('oginurl', loginData)
        .subscribe(
          response => {
            localStorage.setItem('authToken', response.token); // Store token
            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: 'You have successfully logged in!',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Invalid username or password!',
            });
          }
        );
    }
    console.log("Login Successful:", this.loginForm.value);
  }

}
