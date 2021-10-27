import { Test } from '@nestjs/testing'
import { CacheService } from './cache.service'

describe('CacheService', () => {
  let cacheService: CacheService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [
          CacheService,
          {
            provide: 'STORAGE',
            useValue: new Map([
              ['alexey', { test: 'foo' }],
              ['ben', { test: 'bar' }],
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
      expect(await cacheService.mget(['alexey','nothing'])).toEqual([{ test: 'foo' }, undefined])
    })
  })

  describe('del', () => {
    it('should delete element with specified key', async () => {
      await cacheService.del('alexey')
      expect(await cacheService.get('alexey')).toBeUndefined()
    })

    it('should delete element with specified key (not existing)', async () => {
      await cacheService.del('clara')
      expect(await cacheService.get('clara')).toBeUndefined()
    })
  })

  describe('mdel', () => {
    it('should delete elements with specified keys', async () => {
      await cacheService.mdel(['alexey', 'clara'])

      expect(await cacheService.get('clara')).toBeUndefined()
      expect(await cacheService.get('alexey')).toBeUndefined()
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