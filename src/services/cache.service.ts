import { Injectable, Optional, Inject } from '@nestjs/common';

const clone = (obj): any => JSON.parse(JSON.stringify(obj))

@Injectable()
export class CacheService {
  private readonly defaultTtl: number
  private intervalId: ReturnType<typeof setInterval> | undefined

  constructor(
    @Optional()
    @Inject('STORAGE')
    private readonly storage: Record<string, any> = new Map(),
    @Optional()
    @Inject('OPTIONS')
    private readonly options: { ttl?: number }
  ) {
    this.defaultTtl = options?.ttl || 10 * 1000

    this.intervalId = setInterval(() => {
      this.check()
    }, 1000)
  }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    const wrappedValue = this.wrap(value, ttl)
    this.storage.set(key, wrappedValue)
  }

  public async mset(array: { key: string, value: any, ttl?: number }[]): Promise<void> {
    array.forEach(({ key, value, ttl }) => {
      const wrappedValue = this.wrap(value, ttl)
      this.storage.set(key, wrappedValue)
    })

    return
  }

  public async get(key: string): Promise<any> {
    const wrappedValue = this.storage.get(key)

    return this.unwrap(wrappedValue)
  }

  public async mget(keys: string[]): Promise<any[]> {
    return keys.map(key => {
      const wrappedValue = this.storage.get(key)
      return this.unwrap(wrappedValue)
    })
  }

  public async del(key: string): Promise<boolean> {
    if (this.storage.has(key)) {
      this.storage.delete(key)
      return true
    }

    return false
  }

  public async mdel(keys: string[]): Promise<boolean[]> {
    return keys.map((key) => {
      if (this.storage.has(key)) {
        this.storage.delete(key)
        return true
      }

      return false
    })
  }

  public async getTtl(key: string): Promise<number|null> {
    if (this.storage.has(key)) {
      const wrappedValue = this.storage.get(key)
      return wrappedValue.t
    } else {
      return null
    }
  }

  public async updateTtl(key: string, ttl: number): Promise<boolean> {
    if (!this.storage.has(key)) {
      return false
    }

    if (ttl < 0) {
      this.storage.delete(key)
    } else {
      const now = Date.now()

      const wrappedValue = this.storage.get(key)
      wrappedValue.t = now + this.resolveTtl(ttl)
      this.storage.set(key, wrappedValue)
    }

    return true
  }

  public async keys(): Promise<string[]> {
    return [...this.storage.keys()]
  }

  public async has(key: string): Promise<boolean> {
    return this.storage.has(key)
  }

  public async flush(): Promise<void> {
    this.storage.clear()
  }

  private resolveTtl(ttl?: number): number {
    if (ttl === 0) {
      return ttl
    }

    return ttl ? ttl : this.defaultTtl
  }

  private wrap(value: any, ttl?: number): any {
    const now = Date.now()
    const t = now + this.resolveTtl(ttl)

    return {
      t,
      v: value
    }
  }

  private unwrap(value: any): any {
    if (value?.v) {
      return value.v
    }

    return null
  }

  private check(): void {
    const now = Date.now()

    this.storage.forEach((value: { v: any, t: number}, key: string) => {
      if (now > value.t) {
        this.storage.delete(key)
      }
    })
  }
}
