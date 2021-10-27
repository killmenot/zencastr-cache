import { Injectable, Optional, Inject } from '@nestjs/common';


@Injectable()
export class CacheService {
  constructor(
    @Optional()
    @Inject('STORAGE')
    private readonly storage: Record<string, any> = new Map()
  ) {
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.storage.set(key, value)
  }

  mset(array: { key: string, value: any, ttl?: number }[]): Promise<void> {
    array.forEach(({ key, value }) => {
      this.storage.set(key, value)
    })

    return
  }

  async get(key: string): Promise<any> {
    return this.storage.get(key)
  }

  async mget(keys: string[]): Promise<any[]> {
    return keys.map(key => this.storage.get(key))
  }

  async del(key: string): Promise<boolean> {
    if (this.storage.has(key)) {
      this.storage.delete(key)
      return true
    }

    return false
  }

  async mdel(keys: string[]): Promise<boolean[]> {
    return keys.map((key) => {
      if (this.storage.has(key)) {
        this.storage.delete(key)
        return true
      }

      return false
    })
  }

  // ttl(key: string, ttl?: number) {

  // }

  async keys(): Promise<string[]> {
    return [...this.storage.keys()]
  }

  async has(key: string): Promise<boolean> {
    return this.storage.has(key)
  }

  async flush(): Promise<void> {
    this.storage.clear()
  }
}
