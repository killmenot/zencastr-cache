import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { StorageController } from './controllers'
import { CacheService } from './services'

@Module({
  imports: [],
  controllers: [AppController, StorageController],
  providers: [AppService, CacheService],
})
export class AppModule {}
