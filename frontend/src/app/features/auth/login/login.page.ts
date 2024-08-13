import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonIcon, IonButton, IonInput, IonGrid, IonRow, IonCol, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { add, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/common/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'login.page.html',
  standalone: true,
  imports: [
    RouterLink, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonImg, IonCol, IonRow, IonGrid, IonInput, IonButton, IonIcon, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule
  ],
})


export class HomePage {
  private router: Router = inject(Router);
  formLogin: FormGroup;
  showPassword: boolean = false;
  passInputType: string = "password";
  private alertController: AlertController = inject(AlertController);

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(11)]],
    });

    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.passInputType = this.showPassword ? 'text' : 'password';
  }

  isValidControl(ctrl: string) {
    return this.formLogin.controls[ctrl] && (this.formLogin.controls[ctrl].touched || this.formLogin.controls[ctrl].dirty);
  }

  getFieldError(field: string) {
    if (!this.formLogin.controls[field]) return null;
    const errors = this.formLogin.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio';
        case 'minlength':
          return 'Mínimo de caracteres requerido';
        case 'maxlength':
          return 'Máximo de caracteres excedido';
        case 'email':
          return 'Email no válido';
        case 'pattern':
          return 'Mínimo una mayúscula y carácter especial';
      }
    }
    return null;
  }

  async iniciar(loginExitoso: boolean) {

    const alert = await this.alertController.create({
      header: loginExitoso ? 'Sesión Exitosa' : 'Error de inicio de sesión',
      message: loginExitoso ? 'Has iniciado sesión correctamente.' : 'Por favor, verifica tus credenciales e inténtalo de nuevo.',
      buttons: [{
        text: 'OK',
        handler: () => {
          if (loginExitoso) {
            this.router.navigate(['/menu']);
          }
        }
      }]
    });

    this.authenticationService.userLogin(this.formLogin.value)
    .subscribe(data => {
      console.log(data)
      if(data) {
        alert.present();
      }
    })



  }
}
