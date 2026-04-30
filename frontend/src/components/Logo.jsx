export default function Logo({ variant = "white", className = "h-9" }) {
  const src = variant === "black" ? "/iedc_logo_black.png" : "/iedc_logo_white.png";
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={src} 
        alt="IEDC Logo" 
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
