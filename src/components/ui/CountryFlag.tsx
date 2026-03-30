interface CountryFlagProps {
  iso2: string;
  /** Visual size: sm=20px, md=32px, lg=40px */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { w: 20, h: 15 },
  md: { w: 32, h: 24 },
  lg: { w: 40, h: 30 },
};

export default function CountryFlag({ iso2, size = "md", className = "" }: CountryFlagProps) {
  const code = iso2.toLowerCase();
  const { w, h } = SIZE_MAP[size];
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={w}
      height={h}
      alt=""
      aria-hidden="true"
      className={`inline-block rounded-sm object-cover ${className}`}
      style={{ width: w, height: h }}
    />
  );
}
