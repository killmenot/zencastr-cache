import { Test } from '@nestjs/testing'
import { CacheService } from './cache.service'

const wait = (ms) => new Promise<void>((resolve) => {
  setTimeout(() => {
    resolve()
  }, ms)
})

describe('CacheService', () => {
  let cacheService: CacheService
  let now: number

  beforeEach(async () => {
    now = Date.now()

    const moduleRef = await Test.createTestingModule({
        providers: [
          CacheService,
          {
            provide: 'STORAGE',
            useValue: new Map([
              ['alexey', { t: now + 5 * 1000, v: { test: 'foo' } }],
              ['ben', { t: now + 5 * 1000, v: { test: 'bar' } }],
            ]),
          }
        ],
      }).compile()

    cacheService = moduleRef.get<CacheService>(CacheService)
  })

  describe('set', () => {
    it('should add element with specified key', async () => {
      await cacheService.set('clara', { test: 'baz' })
      expect(await cacheService.get('clara')).toEqual({ test: 'baz' })
    })

    it('should update elements with specified key', async () => {
      expect(await cacheService.get('alexey')).toEqual({ test: 'foo' })
      await cacheService.set('alexey', { test: 'baz' })
      expect(await cacheService.get('alexey')).toEqual({ test: 'baz' })
    })
  })

  describe('mset', () => {
    it('should add / update elements with specified keys', async () => {
      await cacheService.mset([
        { key: 'clara', value: { test: 'baz' } },
        { key: 'alexey', value: { test: 'quux' } },
      ])

      expect(await cacheService.get('clara')).toEqual({ test: 'baz' })
      expect(await cacheService.get('alexey')).toEqual({ test: 'quux' })
    })
  })

  describe('get', () => {
    it('should return value for the specified key', async () => {
      expect(await cacheService.get('alexey')).toEqual({ test: 'foo' })
    })
  })

  describe('mget', () => {
    it('should return values for the specified keys', async () => {
      expect(await cacheService.mget(['alexey','nothing'])).toEqual([{ test: 'foo' }, null])
    })
  })

  describe('del', () => {
    it('should delete element with specified key', async () => {
      await cacheService.del('alexey')
      expect(await cacheService.get('alexey')).toBeNull()
    })

    it('should delete element with specified key (not existing)', async () => {
      await cacheService.del('clara')
      expect(await cacheService.get('clara')).toBeNull()
    })
  })

  describe('mdel', () => {
    it('should delete elements with specified keys', async () => {
      await cacheService.mdel(['alexey', 'clara'])

      expect(await cacheService.get('clara')).toBeNull()
      expect(await cacheService.get('alexey')).toBeNull()
    })
  })

  describe('getTtl', () => {
    it('should return ttl', async () => {
      const expected = now + 5 * 1000
      expect(await cacheService.getTtl('alexey')).toBe(expected)
    })

    it('should return null', async () => {
      expect(await cacheService.getTtl('123456')).toBeNull()
    })
  })

  describe('updateTtl', () => {
    it('should return false', async () => {
      expect(await cacheService.updateTtl('123456', 5000)).toBeFalsy()
    })

    it('should delete key (negative)', async () => {
      expect(await cacheService.updateTtl('alexey', -1)).toBeTruthy()
      expect(await cacheService.get('alexey')).toBeNull()
    })

    it('should update ttl (positive, increase)', async () => {
      const ttl1 = await cacheService.getTtl('alexey')
      expect(await cacheService.updateTtl('alexey', 6000)).toBeTruthy()
      const ttl2 = await cacheService.getTtl('alexey')
      
      expect(ttl2).toBeGreaterThan(ttl1)
    })

    it('should update ttl (positive, decrease)', async () => {
      const ttl1 = await cacheService.getTtl('alexey')
      expect(await cacheService.updateTtl('alexey', 2000)).toBeTruthy()
      const ttl2 = await cacheService.getTtl('alexey')
      
      expect(ttl2).toBeLessThan(ttl1)
    })
  })

  describe('keys', () => {
    it('should return an array of keys', async () => {
      expect(await cacheService.keys()).toEqual(['alexey', 'ben'])
    })
  })

  describe('has', () => {
    it('should return true', async () => {
      expect(await cacheService.has('alexey')).toBeTruthy()
    })

    it('should return false', async () => {
      expect(await cacheService.has('david')).toBeFalsy()
    })
  })

  describe('clear', () => {
    it('should clear the storage', async () => {
      await cacheService.flush()
      expect(await cacheService.keys()).toEqual([])
    })
  })
})