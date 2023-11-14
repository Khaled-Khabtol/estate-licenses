import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LicensesModule } from './licenses/licenses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LicensesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres:123456789@localhost:5432/estate-licenses',
      autoLoadEntities: true,
      synchronize: false,  // todo: set false when push to production
    }),
    PassportModule,
    JwtModule.register({ secret: 'trszhq!@$#%^*&()weqzaq', signOptions: { expiresIn: '4h' } }),
    UsersModule,],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
