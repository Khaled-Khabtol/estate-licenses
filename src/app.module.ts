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
import { DatabaseConfigService } from './config/database.service';

@Module({
  imports: [LicensesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    PassportModule,
    JwtModule.register({ secret: 'trszhq!@$#%^*&()weqzaq', signOptions: { expiresIn: '4h' } }),
    UsersModule,],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
