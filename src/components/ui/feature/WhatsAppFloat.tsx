import { FaWhatsapp } from "react-icons/fa";

const FloatingIcons = () => {
  const phoneNumber = "+6283151770146";

  return (
    <a
      href={`https://wa.me/${phoneNumber.replace('+', '')}`} // wa.me doesn't support "+" symbol
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 p-4 rounded-full shadow-lg transition duration-300 backdrop-blur bg-popover/30 border border-foreground/40 text-foreground hover:bg-popover/40"
    >
      <FaWhatsapp size={24} />
    </a>
  );
};

export default FloatingIcons;
