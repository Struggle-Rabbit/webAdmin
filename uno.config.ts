import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['flex-center', 'flex justify-center items-center'],
    ['flex-col-center', 'flex flex-col justify-center items-center'],
    ['flex-between', 'flex justify-between items-center'],
    ['text-ellipsis', 'truncate'],
    ['card-shadow', 'shadow-[0_2px_12px_0_rgba(0,0,0,0.1)]'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: 'rgba(var(--primary-color-rgb), %alpha)',
    },
  },
})
