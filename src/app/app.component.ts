import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {AuthService} from "./business/service/AuthService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  autenticado: boolean = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith('token=')) {
        this.autenticado = true;
      }
    }
  }

  logout() {
    // Borrar la cookie "token"
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Establecer el estado de inicio de sesión en el servicio
    this.authService.setLoggedIn(false);
    // Redirigir a la ruta vacía
    this.router.navigate(['']);
  }
}
