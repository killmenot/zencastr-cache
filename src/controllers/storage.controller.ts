import { Controller, Query, Get, Put, Param, Body, Delete } from '@nestjs/common'
import { CacheService} from '../services'

@Controller('storage')
export class StorageController {
  constructor(private cacheService: CacheService) {}

  @Get('list')
  async keys(): Promise<string[]> {
    return this.cacheService.keys()
  }

  @Get('keys/:id')
  async get(@Param() params): Promise<any> {
    return await this.cacheService.get(params?.id) || null
  }

  @Get('mkeys')
  async mget(@Query('ids') keys): Promise<any> {
    return await this.cacheService.mget(keys || [])
  }

  @Put('keys/:id')
  async set(@Param() params, @Body() data: any): Promise<any> {
    await this.cacheService.set(params?.id, data)

    return this.cacheService.get(params?.id)
  }

  @Put('mkeys')
  async mset(@Body() data: [{ key: string, value: any, ttl?: number}]): Promise<any> {
    const keys = (data || []).map(x => x.key)
    await this.cacheService.mset(data)

    return this.cacheService.mget(keys)
  }

  @Delete('keys/:id')
  async del(@Param() params): Promise<boolean> {
    return this.cacheService.del(params?.id)
  }

  @Delete('mkeys')
  async mdel(@Query('ids') keys): Promise<boolean[]> {
    return this.cacheService.mdel(keys || [])
  }

  @Delete('flush')
  async flush(): Promise<boolean> {
    await this.cacheService.flush()

    return true
  }
}