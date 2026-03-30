interface EducationalImageProps {
  url: string;
  alt: string;
  caption?: string;
  className?: string;
}

export default function EducationalImage({
  url,
  alt,
  caption,
  className = "",
}: EducationalImageProps) {
  return (
    <figure className={`flex flex-col ${className}`}>
      <img
        src={url}
        alt={alt}
        className="w-full rounded-lg object-cover shadow-sm"
        loading="lazy"
      />
      {caption && (
        <figcaption className="text-xs text-text-muted mt-2 text-center leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
