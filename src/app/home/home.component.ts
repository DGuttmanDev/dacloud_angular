import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {AuthService} from "../business/service/AuthService";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  files: ArchivoDTO[] = [];
  selectedFiles: File[] = [];
  autenticado: boolean = false;
  idDirectorioPadre: number = 0;

  constructor(private http: HttpClient, public authService: AuthService) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith('token=')) {
        this.autenticado = true;
      }
    }

  }

  inicio(){
    const token = this.getCookie('token');
    const dirId = 0; // Cambia esto según el directorio del que deseas obtener las vistas previas

    const headers = new HttpHeaders().set('token', token);
    this.http.get<ArchivoDTO[]>('http://localhost:8080/api/file/folder/preview?dir_id=' + dirId, { headers })
      .subscribe(
        (response: ArchivoDTO[]) => {
          // Manejar la respuesta exitosa aquí
          this.files = response;
        },
        (error) => {
          // Manejar el error aquí
          console.error('Error al obtener las vistas previas de los archivos:', error);
        }
      );
  }

  descargarArchivo(file: any) {
    const token = this.getCookie('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token
    });

    this.http.get<DescargaDTO>('http://localhost:8080/api/file/download/mobile?id=' + file.idArchivo, {
      headers: headers
    }).subscribe(response => {
      this.saveBase64File(response.base64Bytes, response.nombre);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }

  saveBase64File(base64String: string, fileName: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    this.saveFile(blob, fileName);
  }

  saveFile(data: Blob, fileName: string) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    const url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  ngOnInit(): void {
    const token = this.getCookie('token');
    const dirId = 0; // Cambia esto según el directorio del que deseas obtener las vistas previas

    const headers = new HttpHeaders().set('token', token);
    this.http.get<ArchivoDTO[]>('http://localhost:8080/api/file/folder/preview?dir_id=' + dirId, { headers })
      .subscribe(
        (response: ArchivoDTO[]) => {
          // Manejar la respuesta exitosa aquí
          this.files = response;
        },
        (error) => {
          // Manejar el error aquí
          console.error('Error al obtener las vistas previas de los archivos:', error);
        }
      );
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    this.uploadFiles()
  }

  uploadFiles() {
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const formData = new FormData();
      for (const file of this.selectedFiles) {
        formData.append('files', file, file.name);
      }
      formData.append('dir_id', this.idDirectorioPadre.toString()); // Reemplaza '0' por el ID del directorio correcto
      const token = this.getCookie("token"); // Reemplaza 'TOKEN_VALUE' por tu token válido
      const headers = { 'token': token };

      this.http.post('http://localhost:8080/api/file/upload', formData, { headers })
        .subscribe(
          response => {
            // Maneja la respuesta exitosa aquí
            console.log('Archivos subidos exitosamente');
            window.location.reload();
          },
          error => {
            // Maneja los errores aquí
            console.error('Error al subir archivos:', error);
          }
        );
    }
  }

  crearCarpeta(){
    const nombreDirectorio = prompt("Ingrese el nombre de la carpeta:");
    if (nombreDirectorio) {
      const newFolderDTO = {
        idDirectorioPadre: this.idDirectorioPadre,
        nombreDirectorio: nombreDirectorio
      };
      const token = this.getCookie("token"); // Reemplaza 'TOKEN_VALUE' por tu token válido
      const headers = { 'token': token };

      this.http.post('http://localhost:8080/api/file/new/folder', newFolderDTO, { headers })
        .subscribe(
          response => {
            // Maneja la respuesta exitosa aquí
            console.log('Carpeta creada exitosamente');
            window.location.reload();
          },
          error => {
            // Maneja los errores aquí
            console.error('Error al crear carpeta:', error);
          }
        );
    } else {
      console.log('Se requiere un nombre de carpeta válido.');
    }
  }

  renameFile(file: any) {
    const newFileName = prompt('Ingrese el nuevo nombre de archivo', this.obtenerNombreArchivoSinExtension(file.nombreArchivo));
    if (newFileName && newFileName.trim() !== '') {
      const token = this.getCookie('token');
      const headers = new HttpHeaders().set('token', token);
      const archivoDTO = { idArchivo: file.idArchivo, nombreArchivo: newFileName.trim(), folder: file.folder };

      this.http.post('http://localhost:8080/api/file/rename', archivoDTO, { headers })
        .subscribe(
          response => {
            // Maneja la respuesta exitosa aquí
            console.log('Archivo renombrado exitosamente');
            window.location.reload();
          },
          error => {
            // Maneja los errores aquí
            console.error('Error al renombrar archivo:', error);
          }
        );
    }
  }

  obtenerNombreArchivoSinExtension(nombreArchivo: string): string {
    const extensionIndex = nombreArchivo.lastIndexOf('.');
    if (extensionIndex !== -1) {
      return nombreArchivo.substring(0, extensionIndex);
    }
    return nombreArchivo;
  }


  deleteFile(file: any) {
    const confirmation = confirm('¿Está seguro de que desea borrar este archivo?');

    if (confirmation) {
      const token = this.getCookie('token');
      const headers = new HttpHeaders().set('token', token);

      this.http.delete(`http://localhost:8080/api/file/delete?id=${file.idArchivo}`, { headers })
        .subscribe(
          response => {
            // Maneja la respuesta exitosa aquí
            console.log('Archivo borrado exitosamente');
            window.location.reload();
          },
          error => {
            // Maneja los errores aquí
            console.error('Error al borrar archivo:', error);
          }
        );
    }
  }

  handleFileClick(file: ArchivoDTO){
    if (file.folder){
      const token = this.getCookie('token');
      const dirId = file.idArchivo; // Cambia esto según el directorio del que deseas obtener las vistas previas

      const headers = new HttpHeaders().set('token', token);
      this.http.get<ArchivoDTO[]>('http://localhost:8080/api/file/folder/preview?dir_id=' + dirId, { headers })
        .subscribe(
          (response: ArchivoDTO[]) => {
            // Manejar la respuesta exitosa aquí
            this.files = response;
            this.idDirectorioPadre = file.idArchivo
          },
          (error) => {
            // Manejar el error aquí
            console.error('Error al obtener las vistas previas de los archivos:', error);
          }
        );
    }
  }

  downloadFile(file: any) {
    // Agrega aquí tu código para manejar la operación de descargar el archivo
  }

  getIconImage(file: ArchivoDTO): string {
    if (file.folder) {
      return 'https://cdn-icons-png.flaticon.com/512/217/217861.png'; // Ícono de carpeta
    } else {
      if (file.nombreArchivo.endsWith('.pdf')) {
        return 'https://cdn-icons-png.flaticon.com/512/337/337946.png'; // Ícono de archivo PDF
      } else if (
        file.nombreArchivo.endsWith('.png') ||
        file.nombreArchivo.endsWith('.jpg') ||
        file.nombreArchivo.endsWith('.jpeg')
      ) {
        return 'https://cdn-icons-png.flaticon.com/256/1829/1829586.png'; // Ícono de archivo de imagen
      } else if (
        file.nombreArchivo.endsWith('.docx') ||
        file.nombreArchivo.endsWith('.doc')
      ) {
        return 'https://cdn-icons-png.flaticon.com/512/337/337932.png'; // Ícono de documento Word
      } else {
        return 'https://cdn-icons-png.flaticon.com/512/2338/2338582.png'; // Ícono de archivo
      }
    }
  }

  private checkTokenCookie(): boolean {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith('token=')) {
        return true;
      }
    }

    return false;
  }


  private getCookie(name: string): string {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return '';
  }
}

interface ArchivoDTO {
  idArchivo: number;
  nombreArchivo: string;
  folder: boolean;
}

interface DescargaDTO {
  id: number;
  nombre: string;
  base64Bytes: string;
}

