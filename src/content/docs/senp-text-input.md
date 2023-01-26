# TextInput

## Props Usage

::DocsDemo{class="!from-blue-800/40 !to-sky-900/40"}
  :ExampleSenpTextInput1
::

## Overriding Styles

::DocsDemo{class="!from-sky-800/40 !to-teal-900/40 mt-6"}
  :ExampleSenpTextInput2
::

## Extending Styles

::DocsDemo{class="!from-teal-800/40 !to-green-900/40 mt-6"}
  :ExampleSenpTextInput3
::

## Component API

### Slots

| Slot Name | Scope | Description |
|---|---|---|
| `label` | – | Label for input (defaults to `label` prop) |
| `hint` | – | Hint for input (defaults to `hint` prop) |
| `error` | – | Error for input (defaults to `error` prop) |

### Props

| Prop | Default | Description |
|---|---|---|
| `modelValue` | – | `string` <br> `v-model` compatible value |
| `label` | – | `string \| undefined` <br> label rendered above the input |
| `hint` | – | `string \| undefined` <br> hint rendered below the input |
| `error` | – | `string \| undefined` <br> error rendered below the input |
| `classes` | – | `Record<string, XClass> \| undefined` <br> Detailed below... |

### Style Props

```ts
type XClass = {
  extend?: string | undefined
  base?: string | undefined
}
```

| Prop | Default | Description |
|---|---|---|
| `classes.wrapper` | – | `XClass` <br> Class applied to outer wrapper |
| `classes.label` | – | `XClass` <br> Class applied to label |
| `classes.input` | – | `XClass` <br> Class applied to input element |
| `classes.hint` | – | `XClass` <br> Class applied to hint |
| `classes.error` | – | `XClass` <br> Class applied to error |