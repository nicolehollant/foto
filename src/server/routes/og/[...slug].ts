import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

export default defineEventHandler(async (event) => {
  const fontFile = await fetch('https://og-playground.vercel.app/inter-latin-ext-700-normal.woff')
  const fontData: ArrayBuffer = await fontFile.arrayBuffer()
  const slug = event.context.params.slug

  const src = `https://object.nyc3.cdn.digitaloceanspaces.com/${slug}`
  try {
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            position: 'relative',
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            background: '#171717',
            color: '#ffffff',
          },
          children: [
            {
              type: 'img',
              props: {
                style: {
                  objectFit: 'contain',
                  maxWidth: '100%',
                  maxHeight: '100%',
                },
                src: src,
                alt: '',
              },
            },
            {
              type: 'p',
              props: {
                style: {
                  background: '#26262680',
                  backdropFilter: 'blur(3px)',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  margin: '0',
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                },
                children: 'imaj.app',
              },
            },
          ],
        },
      },
      {
        width: 500,
        height: 300,
        fonts: [
          {
            name: 'Inter Latin',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    )

    // render to svg as image

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 500,
      },
    })

    const resolved = await Promise.all(
      resvg.imagesToResolve().map(async (url) => {
        const img = await fetch(url)
        const buffer = await img.arrayBuffer()
        return {
          url,
          buffer: Buffer.from(buffer),
        }
      })
    )
    if (resolved.length > 0) {
      for (const result of resolved) {
        const { url, buffer } = result
        resvg.resolveImage(url, buffer)
      }
    }

    const renderData = resvg.render()
    const pngBuffer = renderData.asPng()

    event.res.setHeader('Cache-Control', 's-maxage=7200, stale-while-revalidate')
    return pngBuffer
  } catch (err) {
    return createError({ statusCode: 500, statusMessage: err + '' })
  }
})
