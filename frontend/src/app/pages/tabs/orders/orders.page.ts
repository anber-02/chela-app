import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import io, { type Socket } from 'socket.io-client'
import { DataResponse } from './models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OrdersPage {
  socket!: Socket
  event: string = 'orders-by-user'
  public orders: DataResponse['orders'] = []

  constructor() {
    const user = JSON.parse(localStorage.getItem("USER") ?? "[]")
    const token = localStorage.getItem("sb_s_token")

    console.log(user, token)

    this.socket = io('http://localhost:3000', {
      auth: {
        id: user.id,
        name: user.name,
        rol: user.roles[0]?.rol ?? "user",
        token: token
      },
      reconnection: true
    })

    this.socket.connect()

    this.socket.on(this.event, (data: DataResponse) => {
      this.orders = data.orders
      console.log(data, 'orders')
    })
  }

}
