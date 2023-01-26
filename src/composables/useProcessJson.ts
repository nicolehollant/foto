export const useProcessJson = () => {
  const getJsonValueType = (value: any): 'string' | 'number' | 'object' | 'null' | 'boolean' | 'array' | 'any' => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return 'object'
    }
    if (typeof value === 'object' && Array.isArray(value)) {
      return 'array'
    }
    if (value == null) {
      return 'null'
    }
    if (['string', 'number', 'boolean'].includes(typeof value)) {
      return typeof value as any
    }
    return 'string'
  }

  const defaultValue = (t: string, key: string) =>
    ({
      any: { type: 'any', key, value: '' },
      string: { type: 'string', key, value: '' },
      number: { type: 'number', key, value: 0 },
      object: { type: 'object', key, value: [{ key: 'prop', type: 'string', value: '' }] },
      null: { type: 'null', key, value: null },
      boolean: { type: 'boolean', key, value: false },
      array: {
        type: 'array',
        key,
        value: [''],
        entries: { type: 'string', key: '__entries__', value: '' },
        length: '1',
      },
    }[t])

  const toEditable = (obj: any, forceDefaultValue = false): any[] => {
    const tObj = getJsonValueType(obj)
    if (tObj === 'object') {
      return Object.entries(obj).map(([key, val]: [string, any]) => {
        const tValue = getJsonValueType(val)
        const res = {
          key,
          value:
            tValue === 'object'
              ? toEditable(val, forceDefaultValue)
              : forceDefaultValue
              ? defaultValue(tValue, '')?.value
              : val,
          type: tValue,
        }
        if (tValue === 'array') {
          const entryType =
            val.reduce((prev: any[], a: any) => {
              const currType = getJsonValueType(a)
              if (prev.includes(currType)) {
                return prev
              }
              return [...prev, currType]
            }, []).length === 1
              ? getJsonValueType(val[0])
              : 'any'
          ;(res as any).length = val.length + ''
          ;(res as any).entries = defaultValue(entryType, '__entries__')
          if (entryType === 'object') {
            res.value = val.map((a: any) => toEditable(a))
          }
        }
        return res
      })
    }
    return obj
  }
  return { getJsonValueType, defaultValue, toEditable }
}
