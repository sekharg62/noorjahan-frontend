import Image, { type ImageProps } from "next/image";

type SiteImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/** Local SVGs use native img; photos use next/image optimization */
export function SiteImage({ src, alt, className, priority, sizes, fill }: SiteImageProps) {
  const isSvg = src.endsWith(".svg");
  const isRemote = /^https?:\/\//.test(src);

  if (isSvg) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      sizes={sizes}
      fill={fill}
      unoptimized={isRemote}
    />
  );
}
