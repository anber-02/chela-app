import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, beerOutline, cashOutline, documentTextOutline, fileTrayStackedOutline, pizzaOutline, textOutline } from 'ionicons/icons';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tamaño: string;
  categoria: string;
}

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
  providers: [ModalController]
})
export class CrudPage implements OnInit {

  productos: Producto[] = [];
  productoForm: FormGroup;
  mostrarModal: boolean = false;
  productoSeleccionado: Producto | null = null;

  categoriaOptions = {
    header: 'Selecciona categoría'
  };

  tamanioOptions = {
    header: 'Selecciona tamaño'
  };

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      tamaño: ['', Validators.required],
      categoria: ['', Validators.required],
    });

    addIcons({
      documentTextOutline,
      textOutline,
      cashOutline,
      fileTrayStackedOutline,
      beerOutline,
      addOutline,
      pizzaOutline
    });
  }

  ngOnInit() {
    // Cargar productos desde localStorage
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      this.productos = JSON.parse(productosGuardados);
    } else {
      // Cargar productos iniciales (simulación)
      this.productos = [
        { id: 1, nombre: 'Mojito', descripcion: 'Producto refrescante con menta', precio: 5, categoria: 'Bebida', tamaño: 'grande' },
        { id: 2, nombre: 'Piña Colada', descripcion: 'Producto dulce de coco y piña', precio: 6, categoria: 'Bebida', tamaño: 'grande' },
      ];
    }
  }

  nuevoProducto() {
    this.productoSeleccionado = null;
    this.productoForm.reset();
    this.mostrarModal = true;
  }

  editarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
    this.productoForm.patchValue(producto);
    this.mostrarModal = true;

    // Actualizar localStorage
    localStorage.setItem('productos', JSON.stringify(this.productos));
  }

  borrarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);

    // Actualizar localStorage
    localStorage.setItem('productos', JSON.stringify(this.productos));
  }

  guardarProducto() {
    if (this.productoForm.invalid) {
      return;
    }

    const nuevoProducto = this.productoForm.value as Producto;

    if (this.productoSeleccionado) {
      const index = this.productos.findIndex(p => p.id === this.productoSeleccionado!.id);
      this.productos[index] = { ...nuevoProducto, id: this.productoSeleccionado.id };
    } else {
      nuevoProducto.id = this.productos.length > 0 ? Math.max(...this.productos.map(p => p.id)) + 1 : 1;
      this.productos.push(nuevoProducto);
    }

    // Guardar en localStorage
    localStorage.setItem('productos', JSON.stringify(this.productos));

    console.log('Producto guardado:', nuevoProducto);
    this.cerrarModal();
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  getIconoCategoria(categoria: string): string {
    switch (categoria.toLowerCase()) {
      case 'bebida':
        return 'beer-outline';
      case 'botana':
        return 'pizza-outline'; // Usa 'pizza-outline' si está disponible; de lo contrario, usa un icono alternativo.
      default:
        return 'file-tray-stacked-outline'; // Icono predeterminado
    }
  }
}
