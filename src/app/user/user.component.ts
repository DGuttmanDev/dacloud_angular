import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent  implements OnInit {
  datosActuales?: DatosDTO;
  suscripcionActual: string = "";
  private selectElement: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const token = this.getCookie('token');
    this.obtenerDatosActuales(token);
    this.obtenerSuscripcionActual(token);
  }

  obtenerDatosActuales(token: string): void {
    const headers = new HttpHeaders().set('token', token).set('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.http.get<DatosDTO>('http://localhost:8080/api/session/datos/actual', { headers })
      .subscribe(
        response => {
          this.datosActuales = response;
        },
        error => {
          console.error('Error al obtener los datos actuales:', error);
        }
      );
  }

  obtenerSuscripcionActual(token: string): void {
    const headers = new HttpHeaders().set('token', token).set('Access-Control-Allow-Origin', 'http://localhost:4200');
    this.http.get<string>('http://localhost:8080/api/session/suscripcion/actual', { headers })
      .subscribe(
        response => {
          this.suscripcionActual = response;

        },
        error => {
          console.error('Error al obtener la suscripción actual:', error);
        }
      );
  }

  // Función auxiliar para obtener el valor de una cookie
  getCookie(name: string): string {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split('=');
      if (name === cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return '';
  }
}

interface DatosDTO {
  nombre: string;
  apellidos: string;
}
