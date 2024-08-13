import { Component, inject } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonIcon, IonButton, IonInput, IonGrid, IonRow, IonCol, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonNote } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router, RouterLink } from '@angular/router';
import CryptoES from 'crypto-es'; // Importa desde crypto-es
import { callOutline, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, peopleCircleOutline } from 'ionicons/icons';
import { AuthenticationService } from 'src/app/common/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonNote, RouterLink, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonImg, IonCol, IonRow, IonGrid, IonInput, IonButton, IonIcon, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule
  ],
})
export class RegisterPage {
  registroForm: FormGroup;
  registerCorrect: boolean = false

  private alertController: AlertController = inject(AlertController);
  private router: Router = inject(Router);

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private authenticationService: AuthenticationService
  ) {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    }, {
      validator: this.matchingPasswords('password', 'confirmPassword')
    });

    addIcons({
      peopleCircleOutline,
      mailOutline,
      lockClosedOutline,
      callOutline,
      eyeOffOutline,
      eyeOutline
    });
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.get(passwordKey);
      const confirmPasswordInput = group.get(confirmPasswordKey);
      if (passwordInput?.value !== confirmPasswordInput?.value) {
        return confirmPasswordInput?.setErrors({ notEquivalent: true });
      } else {
        return confirmPasswordInput?.setErrors(null);
      }
    };
  }

  passwordsDoNotMatch() {
    const confirmPassword = this.registroForm.get('confirmPassword');
    return confirmPassword?.errors?.['notEquivalent'] && confirmPassword?.touched;
  }

  async registrar() {

    if (!this.registroForm.valid) this.registerCorrect = false
    this.registerCorrect = true

    const alert = await this.alertController.create({
      header: this.registerCorrect ? 'Registro Exitoso' : 'Error al registrarse',
      message: this.registerCorrect ? 'Has iniciado sesión correctamente.' : 'Por favor, verifica tus datos e inténtalo de nuevo.',
      buttons: [{
        text: 'OK',
        handler: () => {
          if (this.registerCorrect) {
            this.router.navigate(['/profile']);
          }
        }
      }]
    });

    if (this.registroForm.valid) {


      const formValues = this.registroForm.value;
      this.authenticationService.userRegister(formValues).subscribe(data => {
        console.log(data)
        if (data) {
          alert.present();
        }
      })
    }
  }
}
