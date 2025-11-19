import { FaWhatsapp } from "react-icons/fa";

const Cta = () => {
  return (
    <>
      <div className="container text-primary-foreground py-16">
        <div className="container rounded-lg text-center py-16 bg-secondary">
          <h2 className="text-3xl md:text-4xl mb-4">
            Konsultasi dengan tim Dua Insan Story <br /> untuk custom desain
            undangan cetak!
          </h2>
          <div className="container mx-auto px-4 mt-8 text-center flex justify-center gap-4">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-4 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors duration-300 text-lg"
            >
              <FaWhatsapp className="mr-3 text-xl" />
              <span className="text-sm">Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cta;
