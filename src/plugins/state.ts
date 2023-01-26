export default defineNuxtPlugin((nuxtApp) => {
  const customValues = ref([
    {
      name: 'Example',
      values: ['Example 1', 'Example 2', 'Example 3'],
    },
  ])

  const execCustomValue = (index: number) => {
    if (customValues.value[index]) {
      return customValues.value[index].values[Math.floor(Math.random() * customValues.value[index].values.length)]
    }
    return ''
  }

  return {
    provide: {
      state: {
        customValues,
        execCustomValue,
      },
    },
  }
})
