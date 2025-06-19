import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
// import { UserRepository } from 'auth/src/domain/repositories/user.repository';
// import { PrismaUserRepository } from './repositories/user.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    // {
    //   provide:  UserRepository,
    //   useClass: PrismaUserRepository,
    // },
  ],
  exports: [
    // UserRepository,
    PrismaService,
  ],
})
export class PrismaModule {}