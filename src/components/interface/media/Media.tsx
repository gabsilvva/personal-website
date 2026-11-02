import Image, { type ImageProps } from 'next/image'

import type { Media as MediaType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

// `resource` is also an (RDFa) img attribute, so it is dropped from the base props
type Props = Omit<ImageProps, 'src' | 'alt' | 'resource'> & {
  resource?: number | MediaType | null
  alt?: string
}

/** next/image for an uploaded Payload media document. Renders nothing until it is populated. */
export default function Media({ resource, alt, width, height, fill, ...props }: Props) {
  if (!resource || typeof resource !== 'object' || !resource.url) return null

  const src = getMediaUrl(resource.url, resource.updatedAt)
  const sizeProps = fill
    ? { fill }
    : { width: width ?? resource.width ?? undefined, height: height ?? resource.height ?? undefined }

  return <Image src={src} alt={alt ?? resource.alt ?? ''} {...sizeProps} {...props} />
}

/** True when a media relationship is populated and has a file. */
export const hasMedia = (resource?: number | MediaType | null): resource is MediaType =>
  !!resource && typeof resource === 'object' && !!resource.url
