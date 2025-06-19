import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('hello')
export class HelloController {
  constructor(@Inject('CLIENT_SERVICE') private readonly client: ClientKafka){}


  @Get('world')
  async getHellowWorld() : Promise<any> {
    console.log("entrou aki de novo")
    const a ={}
    const result = await firstValueFrom( this.client.send('hello.world', a)); 
    return result;
  }
}