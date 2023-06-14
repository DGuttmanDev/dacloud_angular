
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../business/service/AuthService';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit {
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  nickname: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const registerDTO = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      mail: this.email,
      nick: this.nickname,
      password: this.password
    };

    this.http
      .post<TokenResponse>('http://localhost:8080/api/session/register/web', registerDTO)
      .subscribe(
        (response: TokenResponse) => {
          // Handle successful response here
          console.log('Token:', response.token);
          // Guardar el token en una cookie
          this.setTokenCookie(response.token);
          // Actualizar el estado de inicio de sesión
          this.authService.setLoggedIn(true);
          // Redirigir a la página de inicio
          this.router.navigate(['/home']);
        },
        (error: HttpErrorResponse) => {
          // Handle error here
          console.error('Error al registrar:', error);
        }
      );
  }

  private setTokenCookie(token: string): void {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`;
  }
}

interface TokenResponse {
  token: string;
}

