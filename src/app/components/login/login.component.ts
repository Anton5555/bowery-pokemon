import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm = this.formBuilder.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(8) ]]
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  get emailNotValid() {
    return this.email?.invalid && this.email?.touched;
  }

  get emailValid() {
    return this.email?.valid && this.email?.touched;
  }

  public get emailErrorMessage():string{
    if(this.email?.hasError('email')) return 'Please insert an email with a valid format';
    if(this.email?.touched && this.email?.hasError('required')) return 'An email is required to log in';
    return ' ';
  }

  public get email() { return this.loginForm.get('email'); }

  public get password() { return this.loginForm.get('password'); }

  async login() {
    const userInfo: UserInfo = {
      email: this.email?.value,
      password: this.password?.value
    }
    try {
      this.authService.login(userInfo).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.toastr.error(err);
        }
      });    

    } catch (error) {
      console.log('error');
      console.log(error);
      
    }
  }

}
