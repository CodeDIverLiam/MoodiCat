import logoImage from "../assets/logo.png";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo image */}
      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
        <img 
          src={logoImage} 
          alt="MOODICAT Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Logo text */}
      <div className="flex items-center">
        <span className="text-2xl font-bold text-gray-800">
          MOODICAT
        </span>
      </div>
    </div>
  );
}
