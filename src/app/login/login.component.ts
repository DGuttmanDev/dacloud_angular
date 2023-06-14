import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {Router} from "@angular/router";
import {AuthService} from "../business/service/AuthService";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})

export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const loginDTO = {
      mail: this.email,
      password: this.password
    };

    this.http.post<TokenResponse>('http://localhost:8080/api/session/login/web', loginDTO)
      .subscribe(
        (response: TokenResponse) => {
          // Handle successful response here
          console.log('Token:', response.token);
          // Guardar el token en una cookie
          document.cookie = `token=${response.token}`;

          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + 12 * 60 * 60 * 1000); // 12 horas en milisegundos

          document.cookie = `token=${response.token}; expires=${expirationDate.toUTCString()}; path=/`;

          // Establecer el estado de inicio de sesión en el servicio
          this.authService.setLoggedIn(true);
          // Redirigir a la ruta solicitada
          this.router.navigate(['/home']);
        },
        (error: HttpErrorResponse) => {
          // Handle error here
          console.error('Error al iniciar sesión:', error);
        }
      );
  }
}

interface TokenResponse {
  token: string;
}
