import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // Puedes cambiar '*' por el dominio específico que necesites
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  }
})
export class OrdersGateway implements OnModuleInit {
  constructor(private readonly ordersService: OrdersService) { }

  @WebSocketServer()
  public server: Server

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      // Obtener datos del usuario conectado
      const { name, token, rol, id } = socket.handshake.auth
      if (!name || !token) {
        socket.disconnect()
      }
      if (rol === 'admin') {
        //! Agregando a los admins a una sala y enviando solo a ellos todas las ordenes creadas
        socket.join('admin-room')
        const orders = await this.ordersService.findAll();
        socket.emit('get-orders', orders);

      } else {
        // Enviando las ordenes del usuario que se conecto
        const orders = await this.getOrdersByUser(id)
        socket.emit('orders-by-user', orders)
      }

      socket.on('disconnect', () => {
        console.log('desconectado')
      })
    })


  }
  async getOrdersByUser(id: number) {
    const orders = await this.ordersService.getOrdersByUser(id)
    return orders
  }

  async emitOrdersToAdmins() {
    const orders = await this.ordersService.findAll();
    this.server.to('admin-room').emit('get-orders', orders);
  }

  @SubscribeMessage('createOrder')
  async create(
    @MessageBody() createOrderDto: CreateOrderDto,
    @ConnectedSocket() client: Socket
  ) {
    const { id } = client.handshake.auth

    await this.ordersService.create(createOrderDto);
    this.emitOrdersToAdmins()

    //! Enviando las ordenes de al usuario que la creo para que se actualize
    const orders = await this.getOrdersByUser(id)
    this.server.emit('orders-by-user', orders)
  }

  @SubscribeMessage('findAllOrders')
  async findAll(@MessageBody() { page = 0, size = 20 }: { page: number, size: number }) {
    console.log({ page, })
    const data = await this.ordersService.findAll(page, size)
    console.log(data)
    this.server.emit('get-orders', data)
  }

  @SubscribeMessage('change-status-order')
  async changeStatusOrder(
    @MessageBody() data: { order_id: number, status: string, user_id: number },
  ) {
    await this.ordersService.changeStatusOrder(data);
    const orders = await this.getOrdersByUser(data.user_id)
    this.server.emit('orders-by-user', orders)
    await this.emitOrdersToAdmins()
  }

  /**
   * Todo: Funciones a implementar después
   * @param id 
   * @returns 
  @SubscribeMessage('findOneOrder')
  findOne(@MessageBody() id: number) {
    return this.ordersService.findOne(id);
  }
  @SubscribeMessage('updateOrder')
  update(@MessageBody() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(updateOrderDto.id, updateOrderDto);
  }
  
  
  @SubscribeMessage('removeOrder')
  remove(@MessageBody() id: number) {
    return this.ordersService.remove(id);
  }

   */

}
