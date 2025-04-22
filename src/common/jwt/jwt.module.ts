import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as JwtModuleOriginal } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModuleOriginal.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('jwt.SECRET'),
        signOptions: { expiresIn: configService.get<string>('jwt.EXPIRES_IN') },
      }),
    }),
  ],
  exports: [JwtModuleOriginal],
})
export class JwtModule {}
