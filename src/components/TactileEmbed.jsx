export default function TactileEmbed() {
  return (
    <img
      src="/playground/tactile/tactile-1x"
      srcSet="/playground/tactile/tactile-1x.png 1x, /playground/tactile/tactile-2x.png 2x, /playground/tactile/tactile-3x.png 3x"
      alt="Tactile UI"
      draggable={false}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        background: "#101010",
      }}
    />
  );
}